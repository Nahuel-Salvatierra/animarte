import { GoogleDriveService } from "@/external/google/GoogleDriveService";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams, pathname } = new URL(request.url);
    const pageToken = searchParams.get("pageToken") || undefined;
    const param = pathname.split("/").pop();
    const pageSize = Number(searchParams.get("pageSize")) || 100;

    const driveService = new GoogleDriveService();
    const { files, nextPageToken } = await driveService.listFiles(
      pageToken,
      pageSize,
      param
    );

    return NextResponse.json({
      books: files,
      pagination: {
        nextPageToken,
        hasMore: !!nextPageToken,
      },
    });
  } catch (error) {
    console.log("Error fetching files:", error);
    throw new AxiosError("Error fetching files from Google");
  }
}
