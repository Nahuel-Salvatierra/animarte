"use client";

import { useState, useEffect } from "react";
import BookCatalog from "./BookCatalog";
import SpinnerScreen from "./Spinner";
import { fetchDriveBooks, FetchedBook } from "@/app/actions/fetchDriveBooks";
import ErrorMessage from "./ErrorMessage";

export type Book = Pick<FetchedBook, "id" | "name" | "mimeType"> & {
  images: string[];
};

export function mergeBooksInPairs(books: FetchedBook[]): Book[] {
  const result: Book[] = [];

  for (let i = 0; i < books.length; i += 2) {
    const current = books[i];
    const next = books[i + 1];

    result.push({
      ...current,
      images: [current.image, next.image],
    });
  }

  return result;
}

export default function DriveBookStore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      loadMore();
    }
  }, []);

  const loadMore = async () => {
    setLoading(true);
    try {
      const { books: fetched, pagination } = await fetchDriveBooks(
        nextPageToken || undefined
      );
      const merged = mergeBooksInPairs(fetched);
      setBooks((prev) => [...prev, ...merged]);
      setNextPageToken(pagination.nextPageToken ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
      loadMore={loadMore}
      onRetry={() => {
        setError(null);
        loadMore();
      }}
    />
  );
}
