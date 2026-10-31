'use client';

import BookCatalog from './Catalog';
import ErrorMessage from './ErrorMessage';
import SpinnerScreen from './Spinner';

import useCatalog from '@/hooks/useCatalog';

export default function CatalogStore({ category }: { category?: string }) {
  const { loading, items, error, hasMore, loadMore, reload, total } =
    useCatalog(category);

  if (loading && items.length === 0) {
    return <SpinnerScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => void reload()} />;
  }

  if (!loading && total === 0) {
    return (
      <ErrorMessage
        message="No se encontraron productos."
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <BookCatalog
      files={items}
      isLoading={loading}
      hasMore={hasMore}
      loadMore={loadMore}
      onRetry={() => void reload()}
    />
  );
}
