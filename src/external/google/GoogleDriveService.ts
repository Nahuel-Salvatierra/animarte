import { google, drive_v3 } from "googleapis";

type DriveFile = {
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
        "Faltan variables de entorno (GOOGLE_API_KEY o GOOGLE_DRIVE_FOLDER_ID)"
      );
    }

    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    this.drive = google.drive({
      version: "v3",
      auth: process.env.GOOGLE_API_KEY,
    });
  }

  async listFiles(
    pageToken?: string,
    pageSize: number = 100
  ): Promise<{
    files: DriveFile[];
    nextPageToken?: string;
  }> {
    try {
      const response = await this.drive.files.list({
        q: `'${this.folderId}' in parents and trashed = false`,
        fields:
          "files(id, name, mimeType, webContentLink, thumbnailLink), nextPageToken",
        orderBy: "name",
        pageSize,
        pageToken,
      });

      return {
        files:
          response.data.files?.map((file) => ({
            id: file.id || "",
            name: file.name || "",
            image: file.thumbnailLink || "/placeholder-image.png",
            mimeType: file.mimeType || "",
          })) || [],
        nextPageToken: response.data.nextPageToken || undefined,
      };
    } catch (error) {
      console.error("Error al listar archivos:", error);
      throw new Error("Error al listar archivos de Google Drive");
    }
  }

  async downloadFile(fileId: string) {
    const response = await this.drive.files.get(
      { fileId, fields: "thumbnailLink", alt: "media" },
      { responseType: "arraybuffer" }
    );

    console.log(response.request, "-->> ");

    return response;
  }
}
