'use client';

import { useState } from 'react';

import { FetchedBook, fetchDriveBooks } from '@/app/actions/actionDriveBooks';

export type BookState = FetchedBook;

export type BooksMap = Map<string, BookState>;

export function useBook() {
  const [booksMap, setBooksMap] = useState<BooksMap>();

  const addNewBooks = (newBooks: FetchedBook[]) => {
    setBooksMap((prev) => {
      const newMap = new Map(prev);
      newBooks.forEach((book) => {
        if (!newMap.has(book.id)) {
          newMap.set(book.id, {
            ...book,
          });
        }
      });
      return newMap;
    });
  };

  const loadMore = async (pageToken: string) => {
    const { books, pagination } = await fetchDriveBooks(pageToken);
    addNewBooks(books);
    return pagination.nextPageToken;
  };

  return {
    loadMore,
    booksMap,
  };
}
