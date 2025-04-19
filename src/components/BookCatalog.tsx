"use client";

import BookCard from "./BookCard";
import { useState } from "react";
import { useBook } from "@/hooks/useBook";
import { Book } from "./DriveBookStore";

export default function BookCatalog({
  initialBooks,
  initialNextPageToken,
}: {
  initialBooks: Book[];
  initialNextPageToken?: string;
}) {
  const { loadMore } = useBook();
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadMore = async () => {
    setLoading(true);
    setError(null);
    if (nextPageToken) {
      const token = await loadMore(nextPageToken);
      setNextPageToken(token);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 px-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from(initialBooks.values()).map((book) => (
          <BookCard key={book.id} book={book} onClick={() => {}} />
        ))}
      </div>

      {nextPageToken && (
        <button
          onClick={handleLoadMore}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Cargar más"}
        </button>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
