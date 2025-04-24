'use client';

import { useEffect, useState } from 'react';

import BookCatalog from './BookCatalog';
import { Book } from './DriveBookStore';

import { fetchDriveBooks } from '@/app/actions/actionDriveBooks';
import { fromFetchedBookToBook } from '@/lib/utils';

export default function DriveCoverStore({ category }: { category?: string }) {
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
  }, [category]);

  const loadMore = async (isInitialLoad = false) => {
    try {
      const { books: fetched, pagination } = await fetchDriveBooks(
        category,
        isInitialLoad ? undefined : nextPageToken,
      );

      const books = fromFetchedBookToBook(fetched);

      setBooks((prev) => (isInitialLoad ? books : [...prev, ...books]));
      setNextPageToken(pagination.nextPageToken ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookCatalog
      books={books}
      isLoading={loading}
      hasMore={!!nextPageToken}
      loadMore={loadMore}
      onRetry={() => window.location.reload()}
    />
  );
}
