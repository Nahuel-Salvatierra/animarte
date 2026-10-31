import { describe, expect, it } from 'vitest';

import {
  filterCatalogItems,
  paginateItems,
  sortCatalogItems,
} from './catalogUtils';
import type { CatalogItemView } from './types';

const items: CatalogItemView[] = [
  {
    id: 'b',
    title: 'Bravo',
    category: 'anime',
    kind: 'notebook',
    images: ['/b.webp'],
    coverPath: 'b.webp',
  },
  {
    id: 'a',
    title: 'Alpha',
    category: 'anime',
    kind: 'notebook',
    images: ['/a.webp'],
    coverPath: 'a.webp',
  },
  {
    id: 'c',
    title: 'Charlie',
    category: 'disney',
    kind: 'notebook',
    images: ['/c.webp'],
    coverPath: 'c.webp',
  },
];

describe('sortCatalogItems', () => {
  it('sorts by title ascending', () => {
    const sorted = sortCatalogItems(items, 'title-asc');
    expect(sorted.map((item) => item.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('paginateItems', () => {
  it('returns the first page window and hasMore', () => {
    const page1 = paginateItems(items, 1, 2);
    expect(page1.pageItems).toHaveLength(2);
    expect(page1.hasMore).toBe(true);
    expect(page1.total).toBe(3);

    const page2 = paginateItems(items, 2, 2);
    expect(page2.pageItems).toHaveLength(3);
    expect(page2.hasMore).toBe(false);
  });
});

describe('filterCatalogItems', () => {
  it('filters by title substring and category', () => {
    const filtered = filterCatalogItems(items, {
      category: 'anime',
      query: 'alp',
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('a');
  });
});
