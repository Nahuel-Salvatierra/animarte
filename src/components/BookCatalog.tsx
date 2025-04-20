"use client";

import BookCard from "./BookCard";
import { useEffect, useRef } from "react";
import { Book } from "./DriveBookStore";
import Spinner from "./Spinner";

type Props = {
  books: Book[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onRetry: () => void;
};

export default function BookCatalog({
  books,
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
      { rootMargin: "200px" }
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 px-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from(books.values()).map((book) => (
          <BookCard key={book.id} book={book} onClick={() => {}} />
        ))}
      </div>
      {isLoading && <Spinner />}
      {hasMore && !isLoading && (
        // “Sentinel” invisible para disparar loadMore() al hacer scroll
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
      {!hasMore && <p className="text-center mt-4">No hay más libros.</p>}
    </div>
  );
}
