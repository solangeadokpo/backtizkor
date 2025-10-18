export interface IFileStoreService {
  /**
   * Uploads a file to the storage.
   * @param buffer - The file content as a Buffer.
   * @param filename - The name of the file to be stored.
   * @param mimetype - The MIME type of the file.
   * @returns A promise that resolves with the URL of the uploaded file.
   */
  uploadFile(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string>;

  /**
   * Deletes a file from the storage.
   * @param filename - The name of the file to be deleted.
   */
  deleteFile(filename: string): Promise<void>;
}

export const FileStoreServiceInterface = "FileStoreServiceInterface";
