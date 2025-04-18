import { GoogleDriveService } from "@/external/google/GoogleDriveService";
import { AxiosError } from "axios";
import { FetchedBook } from "../actions/fetchDriveBooks";

export type ApiResponse = {
  books: FetchedBook[];
  pagination: {
    hasMore: boolean;
    nextPageToken?: string;
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || undefined;
    if (!id) throw new Error("No id provided");

    console.log("calling pi");

    const driveService = new GoogleDriveService();
    return await driveService.downloadFile(id);
  } catch (error) {
    console.log("Error fetching files:", error);
    throw new AxiosError("Error fetching files from Google");
  }
}
