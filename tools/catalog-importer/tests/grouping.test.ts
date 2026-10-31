import { describe, expect, it } from 'vitest';

import { groupImagesHeuristically } from '../src/grouping.js';
import type { DriveImageMeta } from '../src/types.js';

function img(id: string, name: string): DriveImageMeta {
  return { id, name, mimeType: 'image/jpeg' };
}

describe('groupImagesHeuristically', () => {
  it('pairs cover and back by explicit hints', () => {
    const result = groupImagesHeuristically(
      [
        img('1', 'princesas-tapa.jpg'),
        img('2', 'princesas-contratapa.jpg'),
      ],
      'anime',
      'notebook',
    );

    expect(result).toHaveLength(1);
    expect(result[0].images).toHaveLength(2);
    expect(result[0].images[0].role).toBe('cover');
    expect(result[0].images[1].role).toBe('back');
    expect(result[0].requiresReview).toBe(false);
  });

  it('marks single images for review', () => {
    const result = groupImagesHeuristically(
      [img('1', 'solo-producto.jpg')],
      'games',
      'notebook',
    );

    expect(result).toHaveLength(1);
    expect(result[0].requiresReview).toBe(true);
    expect(result[0].images).toHaveLength(1);
  });

  it('treats cover category as one image per product', () => {
    const result = groupImagesHeuristically(
      [img('1', 'caratula-a.jpg'), img('2', 'caratula-b.jpg')],
      'cover',
      'cover',
    );

    expect(result).toHaveLength(2);
    expect(result.every((item) => item.images.length === 1)).toBe(true);
  });
});
