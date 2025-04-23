"use client";
import { fetchDriveBooks, FetchedBook } from "@/app/actions/actionDriveBooks";
import { useState } from "react";

// const firstState = (initialBooks: FetchedBook[]) => {
//   {
//     const map = new Map();
//     initialBooks.forEach((book) => {
//       map.set(book.id, {
//         ...book,
//       });
//     });
//     return map;
//   }
// };

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
