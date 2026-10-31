import { describe, expect, it } from 'vitest';

import { groupImagesHeuristically } from '../src/grouping.js';
import type { DriveImageMeta } from '../src/types.js';

function img(id: string, name: string): DriveImageMeta {
  return { id, name, mimeType: 'image/jpeg' };
}

describe('groupImagesHeuristically', () => {
  it('pairs tapa and contratapa by explicit hints', () => {
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
    expect(result[0].images[0].meta.name).toContain('tapa');
    expect(result[0].images[1].role).toBe('back');
    expect(result[0].requiresReview).toBe(false);
  });

  it('pairs 1tapa with contratapa and keeps distinct models', () => {
    const result = groupImagesHeuristically(
      [
        img('1', 'Anime- Black Clover mod 2 1tapa.jpg'),
        img('2', 'Anime- Black Clover mod 2 Contratapa.jpg'),
        img('3', 'Anime- black clover 1 tapa.JPG'),
        img('4', 'Anime- black clover contratapa.JPG'),
      ],
      'anime',
      'notebook',
    );

    expect(result).toHaveLength(2);

    const mod2 = result.find((item) =>
      item.images.some((image) => image.meta.name.includes('mod 2')),
    );
    const base = result.find((item) =>
      item.images.some(
        (image) =>
          image.meta.name.toLowerCase().includes('black clover') &&
          !image.meta.name.toLowerCase().includes('mod'),
      ),
    );

    expect(mod2?.images).toHaveLength(2);
    expect(mod2?.images[0].role).toBe('cover');
    expect(mod2?.images[0].meta.name).toMatch(/1tapa/i);
    expect(mod2?.images[1].role).toBe('back');
    expect(mod2?.images[1].meta.name).toMatch(/contratapa/i);
    expect(mod2?.requiresReview).toBe(false);

    expect(base?.images).toHaveLength(2);
    expect(base?.images[0].role).toBe('cover');
    expect(base?.images[1].role).toBe('back');
    expect(base?.requiresReview).toBe(false);
  });

  it('keeps Mod6 glued to the model number in the pair key', () => {
    const result = groupImagesHeuristically(
      [
        img('1', 'Anime- DBZ Mod6 Superhero 1tapa.jpg'),
        img('2', 'Anime- DBZ Mod6 Superhero contratapa.jpg'),
        img('3', 'Anime- DBZ Mod10 Vegeta Fases 1tapa.jpg'),
        img('4', 'Anime- DBZ Mod10 Vegeta Fases contratapa.jpg'),
      ],
      'anime',
      'notebook',
    );

    expect(result).toHaveLength(2);
    expect(result.every((item) => item.images.length === 2)).toBe(true);
    expect(
      result.every((item) => item.images[0].meta.name.match(/1tapa/i)),
    ).toBe(true);
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
