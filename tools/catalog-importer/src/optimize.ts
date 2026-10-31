import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const MAX_EDGE = 1600;
const WEBP_QUALITY = 82;

export async function optimizeToWebp(
  sourcePath: string,
  destPath: string,
): Promise<void> {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await sharp(sourcePath)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(destPath);
}
