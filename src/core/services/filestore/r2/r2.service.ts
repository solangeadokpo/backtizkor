import { Injectable } from "@nestjs/common";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { IFileStoreService } from "../filestore-service.interface";
import { R2StoreConfigService } from "src/config/filestore/r2/r2.service";

@Injectable()
export class R2Service implements IFileStoreService {
  private readonly bucketName: string;
  private readonly s3: S3Client;

  constructor(private readonly configService: R2StoreConfigService) {
    this.bucketName = this.configService.bucketName;
    this.s3 = new S3Client({
      region: this.configService.region,
      endpoint: this.configService.endpoint,
      credentials: {
        accessKeyId: this.configService.accessKeyId,
        secretAccessKey: this.configService.secretAccessKey,
      },
    });
  }

  /**
   * Uploads a file to R2 storage.
   * @param buffer - The file content as a Buffer.
   * @param filename - The name of the file to be stored.
   * @param mimetype - The MIME type of the file.
   * @returns The URL of the uploaded file.
   */
  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3.send(command);

    return filename;
  }

  /**
   * Deletes a file from R2 storage.
   * @param filename - The name of the file to be deleted.
   */
  async deleteFile(filename: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    await this.s3.send(command);
  }
}
