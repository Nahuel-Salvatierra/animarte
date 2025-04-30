import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

import { FetchedFile } from '../actions/actionDriveBooks';

import { GoogleDriveService } from '@/external/google/GoogleDriveService';

export type ApiResponse = {
  books: FetchedFile[];
  pagination: {
    hasMore: boolean;
    nextPageToken?: string;
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;
    if (!id) throw new Error('No id provided');

    const driveService = new GoogleDriveService();
    const response = await driveService.downloadFile(id);

    return NextResponse.json(response);
  } catch (error) {
    console.log('Error fetching files:', error);
    throw new AxiosError('Error fetching files from Google');
  }
}
