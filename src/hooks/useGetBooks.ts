'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { FetchedFile, fetchDriveBooks } from '@/app/actions/actionDriveBooks';

export default function useGetProducts(productKey?: string) {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<FetchedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const isInitialLoad = books?.length === 0;
  const searchQuery = searchParams.get('query') || '';

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const { books, pagination } = await fetchDriveBooks(
        productKey,
        nextPageToken,
        searchQuery,
      );

      if (searchQuery) {
        setBooks(books);
        setNextPageToken(undefined);
        return;
      }

      setBooks((prev) => (isInitialLoad ? books : [...prev, ...books]));
      setNextPageToken(pagination.nextPageToken ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery]);

  return { books, loading, error, fetchBooks, nextPageToken };
}
