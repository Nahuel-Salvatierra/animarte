import fs from 'node:fs/promises';
import path from 'node:path';

import { createAiProvider } from './ai/index.js';
import {
  CATEGORY_FOLDER_ENV,
  DEFAULT_OUTPUT_DIR,
  DEFAULT_WORK_DIR,
} from './config.js';
import {
  downloadImage,
  listImagesInFolder,
  mapLimit,
} from './drive.js';
import { buildReport, emitCatalog } from './emit.js';
import { groupImagesHeuristically } from './grouping.js';
import type { GroupedCandidate } from './types.js';

export type PipelineOptions = {
  categories?: string[];
  outputDir?: string;
  workDir?: string;
  concurrency?: number;
  skipAi?: boolean;
  confidenceThreshold?: number;
};

async function loadCheckpoint(filePath: string): Promise<Set<string>> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as { downloadedIds?: string[] };
    return new Set(parsed.downloadedIds ?? []);
  } catch {
    return new Set();
  }
}

async function saveCheckpoint(
  filePath: string,
  downloadedIds: Set<string>,
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(
    filePath,
    JSON.stringify({ downloadedIds: [...downloadedIds] }, null, 2),
    'utf8',
  );
}

export async function runImportPipeline(
  options: PipelineOptions = {},
): Promise<void> {
  const categories =
    options.categories && options.categories.length > 0
      ? options.categories
      : Object.keys(CATEGORY_FOLDER_ENV);
  const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR;
  const workDir = options.workDir ?? DEFAULT_WORK_DIR;
  const concurrency = options.concurrency ?? 4;
  const confidenceThreshold = options.confidenceThreshold ?? 0.85;
  const ai = options.skipAi ? null : createAiProvider();

  const allCandidates: GroupedCandidate[] = [];
  let totalImages = 0;
  let aiCalls = 0;

  for (const category of categories) {
    const envKey = CATEGORY_FOLDER_ENV[category];
    const folderId = envKey ? process.env[envKey] : undefined;
    if (!folderId) {
      console.warn(`Skipping ${category}: missing ${envKey}`);
      continue;
    }

    console.log(`Listing ${category}...`);
    const listed = await listImagesInFolder(folderId);
    totalImages += listed.length;

    const categoryWorkDir = path.join(workDir, 'downloads', category);
    const checkpointPath = path.join(workDir, `checkpoint-${category}.json`);
    const downloaded = await loadCheckpoint(checkpointPath);

    const withLocal = (
      await mapLimit(listed, concurrency, async (meta) => {
        try {
          const result = await downloadImage(meta, categoryWorkDir);
          downloaded.add(meta.id);
          return result;
        } catch (error) {
          console.warn(
            `Skip download ${meta.name}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          return null;
        }
      })
    ).filter((meta): meta is NonNullable<typeof meta> => meta !== null);
    await saveCheckpoint(checkpointPath, downloaded);

    const kind = category === 'cover' ? 'cover' : 'notebook';
    let candidates = groupImagesHeuristically(withLocal, category, kind);

    if (ai) {
      const refined: GroupedCandidate[] = [];
      for (const candidate of candidates) {
        if (
          !candidate.requiresReview &&
          candidate.confidence >= confidenceThreshold
        ) {
          refined.push(candidate);
          continue;
        }

        const imageBase64 = [];
        for (const image of candidate.images) {
          if (!image.meta.localPath) continue;
          const buffer = await fs.readFile(image.meta.localPath);
          imageBase64.push({
            mimeType: image.meta.mimeType,
            data: buffer.toString('base64'),
            fileName: image.meta.name,
          });
        }

        try {
          const result = await ai.classify({ candidate, imageBase64 });
          aiCalls += 1;
          const coverMeta =
            candidate.images.find(
              (image) => image.meta.name === result.coverFileName,
            ) ?? candidate.images.find((image) => image.role === 'cover');
          const backMeta =
            candidate.images.find(
              (image) => image.meta.name === result.backFileName,
            ) ?? candidate.images.find((image) => image.role === 'back');

          refined.push({
            ...candidate,
            titleHint: result.title,
            category: result.category,
            kind: result.kind,
            confidence: result.confidence,
            requiresReview: result.requiresReview,
            reason: result.reason,
            images: [
              ...(coverMeta
                ? [{ meta: coverMeta.meta, role: 'cover' as const }]
                : []),
              ...(backMeta
                ? [{ meta: backMeta.meta, role: 'back' as const }]
                : []),
            ],
          });
        } catch (error) {
          console.warn(
            `AI failed for ${candidate.groupKey}:`,
            error instanceof Error ? error.message : error,
          );
          refined.push({
            ...candidate,
            requiresReview: true,
            reason: 'AI classification failed',
          });
        }
      }
      candidates = refined;
    }

    allCandidates.push(...candidates);
  }

  const estimatedAiCostUsd = aiCalls * 0.002;
  const report = buildReport(allCandidates, totalImages, estimatedAiCostUsd);
  const { products, reviewQueue } = await emitCatalog({
    outputDir,
    candidates: allCandidates,
    report,
  });

  console.log(
    JSON.stringify(
      {
        outputDir,
        products: products.length,
        reviewQueue: reviewQueue.length,
        aiCalls,
        report,
      },
      null,
      2,
    ),
  );
}
