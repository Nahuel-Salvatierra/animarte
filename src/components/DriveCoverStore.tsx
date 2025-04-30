'use client';

import Catalog from './Catalog';
import ErrorMessage from './ErrorMessage';
import SpinnerScreen from './Spinner';

import useGetProducts from '@/hooks/useGetBooks';
import { fromFetchedFileToFiles } from '@/lib/utils';

export default function DriveCoverStore({ category }: { category?: string }) {
  const {
    loading,
    books: fetched,
    error,
    nextPageToken,
    fetchBooks,
  } = useGetProducts(category);

  const cover = fromFetchedFileToFiles(fetched);

  if (loading && cover.length === 0) {
    return <SpinnerScreen />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <Catalog
      files={cover}
      isLoading={loading}
      hasMore={!!nextPageToken}
      loadMore={fetchBooks}
      onRetry={() => window.location.reload()}
    />
  );
}
