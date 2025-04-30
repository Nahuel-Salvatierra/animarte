import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FetchedFile } from '@/app/actions/actionDriveBooks';
import { FileDrive } from '@/components/DriveBookStore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageBase64 = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  const base64Image = arrayBufferToBase64(json);
  const base64 = `data:image/jpeg;base64,${base64Image}`;

  return base64;
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

export function streamToBase64(
  stream: NodeJS.ReadableStream,
  contentType = 'image/png',
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
    );
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(`data:${contentType};base64,${buffer.toString('base64')}`);
    });
    stream.on('error', (err) => reject(err));
  });
}

export function mergeFileFetchedInPairs(books: FetchedFile[]): FileDrive[] {
  const result: FileDrive[] = [];

  for (let i = 0; i < books.length; i += 2) {
    const current = books[i];
    const next = books[i + 1];

    result.push({
      ...current,
      images: [current.image, next?.image || current.image],
    });
  }

  return result;
}

export function fromFetchedFileToFiles(files: FetchedFile[]): FileDrive[] {
  return files.map((fetchedFile) => ({
    id: fetchedFile.id,
    name: fetchedFile.name,
    mimeType: fetchedFile.mimeType,
    images: [fetchedFile.image],
  }));
}

export const removeExtension = (fileName: string) => {
  return fileName.replace(/\.[^/.]+$/, '');
};
