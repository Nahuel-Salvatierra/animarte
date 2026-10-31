'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  fetchCatalogItems,
  paginateItems,
  sortCatalogItems,
} from '@/catalog/fetchCatalog';
import type { CatalogItemView } from '@/catalog/types';

const PAGE_SIZE = 24;

export default function useCatalog(category?: string) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [allItems, setAllItems] = useState<CatalogItemView[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchCatalogItems({
        category,
        query: searchQuery,
        force: true,
      });
      setAllItems(sortCatalogItems(items, 'title-asc'));
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  const { pageItems, hasMore, total } = useMemo(
    () => paginateItems(allItems, page, PAGE_SIZE),
    [allItems, page],
  );

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setPage((current) => current + 1);
  }, [hasMore, loading]);

  return {
    items: pageItems,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    reload: load,
  };
}
