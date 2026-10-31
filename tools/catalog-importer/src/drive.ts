import fs from 'node:fs/promises';
import path from 'node:path';

import { google } from 'googleapis';

import { getGoogleApiKey } from './config.js';
import type { DriveImageMeta } from './types.js';

const IMAGE_MIME_PREFIX = 'image/';

export function createDriveClient() {
  return google.drive({
    version: 'v3',
    auth: getGoogleApiKey(),
  });
}

export async function listImagesInFolder(
  folderId: string,
): Promise<DriveImageMeta[]> {
  const drive = createDriveClient();
  const files: DriveImageMeta[] = [];
  let pageToken: string | undefined;

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields:
        'nextPageToken, files(id, name, mimeType, size, modifiedTime)',
      pageSize: 1000,
      pageToken,
      orderBy: 'name',
    });

    for (const file of response.data.files ?? []) {
      if (!file.id || !file.name || !file.mimeType) continue;
      if (!file.mimeType.startsWith(IMAGE_MIME_PREFIX)) continue;
      files.push({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size ?? undefined,
        modifiedTime: file.modifiedTime ?? undefined,
      });
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return files;
}

export async function downloadImage(
  meta: DriveImageMeta,
  destDir: string,
): Promise<DriveImageMeta> {
  await fs.mkdir(destDir, { recursive: true });
  const localPath = path.join(destDir, `${meta.id}-${meta.name}`);

  try {
    await fs.access(localPath);
    return { ...meta, localPath };
  } catch {
    // file missing — download
  }

  // API keys can list shared folders but Drive v3 alt=media often returns 403.
  // Public/shared images download reliably via the uc export endpoint.
  const url = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(meta.id)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${meta.name} (${meta.id}): HTTP ${response.status}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const head = buffer.subarray(0, 32).toString('utf8').toLowerCase();
  if (head.includes('<html') || head.includes('<!doctype')) {
    throw new Error(
      `Download returned HTML instead of image for ${meta.name} (${meta.id})`,
    );
  }

  await fs.writeFile(localPath, buffer);
  return { ...meta, localPath };
}

export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function run(): Promise<void> {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await worker(items[current], current);
    }
  }

  const runners = Array.from({ length: Math.min(limit, items.length) }, () =>
    run(),
  );
  await Promise.all(runners);
  return results;
}
