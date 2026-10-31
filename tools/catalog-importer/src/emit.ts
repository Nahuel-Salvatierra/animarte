import fs from 'node:fs/promises';
import path from 'node:path';

import {
  CatalogFileSchema,
  CategoriesFileSchema,
  ImportReportSchema,
  type CatalogProduct,
  type ImportReport,
} from '../../../src/catalog/schema';
import { CATALOG_CATEGORIES } from '../../../src/catalog/categories';
import { optimizeToWebp } from './optimize.js';
import { slugify } from './slug.js';
import type { GroupedCandidate } from './types.js';

function ensureUniqueId(base: string, used: Set<string>): string {
  let id = base;
  let index = 1;
  while (used.has(id)) {
    index += 1;
    id = `${base}-${String(index).padStart(3, '0')}`;
  }
  used.add(id);
  return id;
}

export async function emitCatalog(options: {
  outputDir: string;
  candidates: GroupedCandidate[];
  report: ImportReport;
}): Promise<{ products: CatalogProduct[]; reviewQueue: GroupedCandidate[] }> {
  const { outputDir, candidates, report } = options;
  const productsDir = path.join(outputDir, 'products');
  await fs.mkdir(productsDir, { recursive: true });

  const usedIds = new Set<string>();
  const products: CatalogProduct[] = [];
  const reviewQueue: GroupedCandidate[] = [];

  for (const candidate of candidates) {
    if (candidate.requiresReview || candidate.confidence < 0.7) {
      reviewQueue.push(candidate);
    }

    const cover = candidate.images.find((image) => image.role === 'cover');
    const back = candidate.images.find((image) => image.role === 'back');
    if (!cover?.meta.localPath) {
      reviewQueue.push(candidate);
      continue;
    }

    const baseSlug = slugify(candidate.titleHint) || candidate.groupKey;
    const id = ensureUniqueId(`${baseSlug}-001`, usedIds);
    const productDir = path.join(productsDir, candidate.category, id);
    const coverRel = `products/${candidate.category}/${id}/cover.webp`;
    const coverAbs = path.join(outputDir, coverRel);
    await optimizeToWebp(cover.meta.localPath, coverAbs);

    let backRel: string | undefined;
    if (back?.meta.localPath) {
      backRel = `products/${candidate.category}/${id}/back.webp`;
      await optimizeToWebp(back.meta.localPath, path.join(outputDir, backRel));
    }

    products.push({
      id,
      title: candidate.titleHint,
      slug: id,
      category: candidate.category,
      kind: candidate.kind,
      images: {
        cover: coverRel,
        ...(backRel ? { back: backRel } : {}),
      },
      active: !candidate.requiresReview,
      source: {
        driveFileIds: candidate.images.map((image) => image.meta.id),
      },
    });
  }

  const catalog = CatalogFileSchema.parse({
    version: 1,
    generatedAt: new Date().toISOString(),
    products,
  });

  const categories = CategoriesFileSchema.parse({
    categories: CATALOG_CATEGORIES,
  });

  await fs.writeFile(
    path.join(outputDir, 'catalog.json'),
    JSON.stringify(catalog, null, 2),
    'utf8',
  );
  await fs.writeFile(
    path.join(outputDir, 'categories.json'),
    JSON.stringify(categories, null, 2),
    'utf8',
  );
  await fs.writeFile(
    path.join(outputDir, 'import-report.json'),
    JSON.stringify(ImportReportSchema.parse(report), null, 2),
    'utf8',
  );
  await fs.writeFile(
    path.join(outputDir, 'review-queue.json'),
    JSON.stringify(reviewQueue, null, 2),
    'utf8',
  );

  return { products, reviewQueue };
}

export function buildReport(
  candidates: GroupedCandidate[],
  totalImages: number,
  estimatedAiCostUsd = 0,
): ImportReport {
  const productsWithCoverAndBack = candidates.filter(
    (candidate) =>
      candidate.images.some((image) => image.role === 'cover') &&
      candidate.images.some((image) => image.role === 'back'),
  ).length;

  const productsWithIncompleteImages = candidates.filter(
    (candidate) =>
      candidate.kind === 'notebook' &&
      !candidate.images.some((image) => image.role === 'back'),
  ).length;

  const unclassifiedImages = candidates.filter((candidate) =>
    candidate.images.some((image) => image.role === 'unknown'),
  ).length;

  const pendingReview = candidates.filter(
    (candidate) => candidate.requiresReview,
  ).length;

  const titleCounts = new Map<string, number>();
  for (const candidate of candidates) {
    const key = slugify(candidate.titleHint);
    titleCounts.set(key, (titleCounts.get(key) ?? 0) + 1);
  }
  const potentialDuplicates = [...titleCounts.values()].filter(
    (count) => count > 1,
  ).length;

  return ImportReportSchema.parse({
    totalImages,
    totalProducts: candidates.length,
    productsWithCoverAndBack,
    productsWithIncompleteImages,
    unclassifiedImages,
    potentialDuplicates,
    pendingReview,
    estimatedAiCostUsd,
  });
}
