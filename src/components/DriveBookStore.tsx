'use client';

import BookCatalog from './Catalog';
import ErrorMessage from './ErrorMessage';
import SpinnerScreen from './Spinner';

import { FetchedFile } from '@/app/actions/actionDriveBooks';
import useGetProducts from '@/hooks/useGetBooks';
import { mergeFileFetchedInPairs } from '@/lib/utils';

export type FileDrive = Pick<FetchedFile, 'id' | 'name' | 'mimeType'> & {
  images: string[];
};

export default function DriveBookStore({ category }: { category?: string }) {
  const {
    loading,
    books: fetched,
    error,
    nextPageToken,
    fetchBooks,
  } = useGetProducts(category);

  const books = fetched && mergeFileFetchedInPairs(fetched);

  if (loading && books.length === 0) {
    return <SpinnerScreen />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      {books && (
        <BookCatalog
          files={books}
          isLoading={loading}
          hasMore={!!nextPageToken}
          loadMore={fetchBooks}
          onRetry={() => window.location.reload()}
        />
      )}
    </>
  );
}
