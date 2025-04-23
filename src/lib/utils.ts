import { FetchedBook } from "@/app/actions/actionDriveBooks";
import { Book } from "@/components/DriveBookStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  return Buffer.from(buffer).toString("base64");
}

export function streamToBase64(
  stream: NodeJS.ReadableStream,
  contentType = "image/png"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(`data:${contentType};base64,${buffer.toString("base64")}`);
    });
    stream.on("error", (err) => reject(err));
  });
}

export function mergeBooksInPairs(books: FetchedBook[]): Book[] {
  const result: Book[] = [];

  for (let i = 0; i < books.length; i += 2) {
    const current = books[i];
    const next = books[i + 1];

    result.push({
      ...current,
      images: [current.image, next?.image || current.image], // Evitar undefined si no hay next
    });
  }

  return result;
}
