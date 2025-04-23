import { getFromLocalStorage } from '../../lib/getFromLocalStorage';
import { CategoryEnum } from '../books/[category]/caterogy.enum';
import { ApiResponse } from '../google/route';

import { axiosClient } from '@/config/axios';

export type FetchedBook = {
  id: string;
  name: string;
  image: string;
  mimeType: string;
};

export async function fetchDriveBooks(
  category?: string,
  pageToken?: string,
): Promise<{
  books: FetchedBook[];
  pagination: {
    nextPageToken?: string;
    hasMore: boolean;
  };
}> {
  const baseUrl = category
    ? `/books/${category}`
    : `/books/${CategoryEnum.anime}`;
  const url = pageToken ? `${baseUrl}?pageToken=${pageToken}` : baseUrl;
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
