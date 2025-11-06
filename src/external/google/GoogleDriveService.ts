import { drive_v3, google } from 'googleapis';

import { CategoryEnum } from '@/app/books/[category]/caterogy.enum';

export type DriveFile = {
  id: string;
  name: string;
  image: string;
  mimeType: string;
};

export class GoogleDriveService {
  private drive: drive_v3.Drive;
  private folderId: string;

  constructor() {
    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new Error(
        'Missing environment variables (GOOGLE_API_KEY o GOOGLE_DRIVE_FOLDER_ID)',
      );
    }

    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    this.drive = google.drive({
      version: 'v3',
      auth: process.env.GOOGLE_API_KEY,
    });
  }

  private getFolderId(string?: string) {
    switch (string) {
      case CategoryEnum.anime:
        return process.env.GOOGLE_ANIME_FOLDER_ID;
      case CategoryEnum.cartoon:
        return process.env.GOOGLE_CARTOON_FOLDER_ID;
      case CategoryEnum.superhero:
        return process.env.GOOGLE_SUPERHEROS_FOLDER_ID;
      case CategoryEnum.disney:
        return process.env.GOOGLE_DISNEY_FOLDER_ID;
      case CategoryEnum.series:
        return process.env.GOOGLE_SERIES_FOLDER_ID;
      case CategoryEnum.music:
        return process.env.GOOGLE_MUSIC_FOLDER_ID;
      case CategoryEnum.football:
        return process.env.GOOGLE_FOOTBALL_FOLDER_ID;
      case CategoryEnum.cover:
        return process.env.GOOGLE_COVER_ID;
      case CategoryEnum.games:
        return process.env.GOOGLE_GAMES_FOLDER_ID;
      default:
        return this.folderId;
    }
  }

  async searchByName(fileName: string): Promise<{
    files: DriveFile[];
  }> {
    const folderId = process.env.GOOGLE_DRIVE_SEARCH_FOLDER_ID;
    const googleSearchApiKey = process.env.GOOGLE_DRIVE_SEARCH_API_KEY;
    const q = `'${folderId}' in parents and name contains '${fileName}' and trashed = false`;

    try {
      const response = await this.drive.files.list({
        q,
        auth: googleSearchApiKey,
        orderBy: 'name',
        fields: 'files(id, name, mimeType, webContentLink, thumbnailLink)',
      });

      return {
        files:
          response.data.files?.map((file) => ({
            id: file.id || '',
            name: file.name || '',
            image: file.thumbnailLink || '/placeholder-image.png',
            mimeType: file.mimeType || '',
          })) || [],
      };
    } catch (error) {
      console.error('Error al buscar archivos:', error || error);
      throw new Error('Error al buscar archivos en Google Drive');
    }
  }

  async listFiles(
    pageToken?: string,
    pageSize: number = 100,
    category?: string,
    fileName?: string,
  ): Promise<{
    files: DriveFile[];
    nextPageToken?: string;
  }> {
    const folderId = this.getFolderId(category);

    if (fileName) {
      const files = await this.searchByName(fileName);
      return files;
    }

    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields:
          'files(id, name, mimeType, webContentLink, thumbnailLink), nextPageToken',
        orderBy: 'name',
        pageSize,
        pageToken,
      });

      return {
        files:
          response.data.files?.map((file) => ({
            id: file.id || '',
            name: file.name || '',
            image: file.thumbnailLink || '/placeholder-image.png',
            mimeType: file.mimeType || '',
          })) || [],
        nextPageToken: response.data.nextPageToken || undefined,
      };
    } catch (error) {
      console.error('Error al listar archivos:', error);
      throw new Error('Error al listar archivos de Google Drive');
    }
  }

  async downloadFile(fileId: string) {
    const response = await this.drive.files.get(
      { fileId, fields: 'thumbnailLink', alt: 'media' },
      { responseType: 'arraybuffer' },
    );

    return response;
  }
}
