import { describe, expect, it } from 'vitest';

import {
  CatalogFileSchema,
  CatalogProductSchema,
} from '../../../src/catalog/schema';

describe('catalog schema', () => {
  it('accepts a valid product', () => {
    const product = CatalogProductSchema.parse({
      id: 'cuaderno-princesas-001',
      title: 'Cuaderno Princesas',
      slug: 'cuaderno-princesas-001',
      category: 'disney',
      kind: 'notebook',
      images: {
        cover: 'products/disney/cuaderno-princesas-001/cover.webp',
        back: 'products/disney/cuaderno-princesas-001/back.webp',
      },
      active: true,
    });

    expect(product.id).toBe('cuaderno-princesas-001');
  });

  it('rejects missing cover image', () => {
    expect(() =>
      CatalogProductSchema.parse({
        id: 'x',
        title: 'X',
        slug: 'x',
        category: 'anime',
        kind: 'notebook',
        images: {},
        active: true,
      }),
    ).toThrow();
  });

  it('accepts catalog file wrapper', () => {
    const catalog = CatalogFileSchema.parse({
      version: 1,
      products: [],
    });
    expect(catalog.products).toEqual([]);
  });
});
