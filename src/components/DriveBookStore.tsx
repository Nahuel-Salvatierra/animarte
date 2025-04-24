'use client';

import { useEffect, useState } from 'react';

import BookCatalog from './BookCatalog';
import ErrorMessage from './ErrorMessage';
import SpinnerScreen from './Spinner';

import { FetchedBook, fetchDriveBooks } from '@/app/actions/actionDriveBooks';
import { mergeBooksInPairs } from '@/lib/utils';

export type Book = Pick<FetchedBook, 'id' | 'name' | 'mimeType'> & {
  images: string[];
};

export default function DriveBookStore({ category }: { category?: string }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setBooks([]);
    setNextPageToken(undefined);
    setError(null);

    loadMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const loadMore = async (isInitialLoad = false) => {
    try {
      const { books: fetched, pagination } = await fetchDriveBooks(
        category,
        isInitialLoad ? undefined : nextPageToken,
      );
      const merged = mergeBooksInPairs(fetched);

      setBooks((prev) => (isInitialLoad ? merged : [...prev, ...merged]));
      setNextPageToken(pagination.nextPageToken ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading && books.length === 0) {
    return <SpinnerScreen />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <BookCatalog
      books={books}
      isLoading={loading}
      hasMore={!!nextPageToken}
      loadMore={() => loadMore(false)}
      onRetry={() => {
        setError(null);
        loadMore(true);
      }}
    />
  );
}
