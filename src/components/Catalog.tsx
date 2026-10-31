'use client';

import { useEffect, useRef } from 'react';

import CatalogCard from './CatalogCard';

import type { CatalogItemView } from '@/catalog/types';
import Spinner from './Spinner';

type Props = {
  files: CatalogItemView[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onRetry: () => void;
};

export default function Catalog({
  files,
  isLoading,
  hasMore,
  loadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 px-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file) => (
          <CatalogCard key={file.id} item={file} />
        ))}
      </div>
      {isLoading && <Spinner />}
      {hasMore && !isLoading && <div ref={sentinelRef} style={{ height: 1 }} />}
      {!hasMore && files.length > 0 && (
        <p className="text-center mt-4">No hay más productos.</p>
      )}
    </div>
  );
}
