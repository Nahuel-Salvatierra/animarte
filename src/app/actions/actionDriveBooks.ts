import { getFromLocalStorage } from '../../lib/getFromLocalStorage';
import { CategoryEnum } from '../books/[category]/caterogy.enum';
import { ApiResponse } from '../google/route';

import { axiosClient } from '@/config/axios';

export type FetchedFile = {
  id: string;
  name: string;
  image: string;
  mimeType: string;
};

export async function fetchDriveBooks(
  productKey?: string,
  pageToken?: string,
  searchQuery?: string,
): Promise<{
  books: FetchedFile[];
  pagination: {
    nextPageToken?: string;
    hasMore: boolean;
  };
}> {
  const baseUrl = productKey
    ? `/books/${productKey}`
    : `/books/${CategoryEnum.anime}`;

  const url = new URL(
    pageToken ? `${baseUrl}?pageToken=${pageToken}` : baseUrl,
    process.env.NEXT_PUBLIC_BASE_URL,
  );

  if (searchQuery) {
    url.searchParams.set('query', searchQuery);
  }

  const cacheKey = `driveBooksCache:${url.toString()}`;

  return getFromLocalStorage({
    key: cacheKey,
    loadIfMissing: async () => {
      const response = await axiosClient.get<ApiResponse>(url.toString());

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
