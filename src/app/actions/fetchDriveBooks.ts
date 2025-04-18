import { axiosClient } from "@/config/axios";
import { ApiResponse } from "../books/route";
import { getFromLocalStorage } from "../../lib/getFromLocalStorage";

export type FetchedBook = {
  id: string;
  name: string;
  image: string;
  mimeType: string;
};

export async function fetchDriveBooks(pageToken?: string): Promise<{
  books: FetchedBook[];
  pagination: {
    nextPageToken?: string;
    hasMore: boolean;
  };
}> {
  const url = pageToken ? `/books?pageToken=${pageToken}` : "/books";
  const cacheKey = `driveBooksCache:${url}`;

  return getFromLocalStorage({
    key: cacheKey,
    loadIfMissing: async () => {
      const response = await axiosClient.get<ApiResponse>(url);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        books: response.data.books,
        pagination: response.data.pagination,
      };
    },
  });
}
