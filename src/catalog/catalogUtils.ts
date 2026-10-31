import type { CatalogItemView } from './types';

export function sortCatalogItems(
  items: CatalogItemView[],
  sort: 'title-asc' | 'title-desc' = 'title-asc',
): CatalogItemView[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const cmp = a.title.localeCompare(b.title, 'es');
    return sort === 'title-desc' ? -cmp : cmp;
  });
  return sorted;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): { pageItems: T[]; hasMore: boolean; total: number } {
  const safePage = Math.max(page, 1);
  const end = safePage * pageSize;
  return {
    pageItems: items.slice(0, end),
    hasMore: end < items.length,
    total: items.length,
  };
}

export function filterCatalogItems(
  items: CatalogItemView[],
  options?: { category?: string; query?: string },
): CatalogItemView[] {
  const query = options?.query?.trim().toLowerCase() ?? '';
  return items.filter((item) => {
    if (options?.category && item.category !== options.category) {
      return false;
    }
    if (query && !item.title.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });
}
