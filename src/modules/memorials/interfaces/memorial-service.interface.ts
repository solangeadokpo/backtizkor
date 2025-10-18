import { ICrudService } from "src/core/services/crud/interfaces/crud-service.interface";
import { MemorialDocument } from "../schemas/memorial.schema";
import { CreateMemorialDto } from "../dto/create-memorial.dto";
import { UpdateMemorialDto } from "../dto/update-memorial.dto";
import { MediaItem } from "../schemas/media.schema";

export interface IMemorialsService
  extends ICrudService<MemorialDocument, CreateMemorialDto, UpdateMemorialDto> {
  /**
   * Increase or decrease the value of memorial likes
   *
   * @param memorial
   */
  updateLikesCount(
    memorial: string,
    increment?: boolean,
  ): Promise<MemorialDocument>;

  /**
   * Uploads a profile media for a memorial
   *
   * @param memorialId - The ID of the memorial
   * @param file - The media file to upload
   * @returns The uploaded media document
   */
  uploadProfileMedia(
    memorial: MemorialDocument,
    file: Express.Multer.File,
  ): Promise<MemorialDocument>;

  /**
   * Uploads media files for a memorial
   *
   * @param memorial - The memorial document
   * @param files - The media files to upload
   * @returns The uploaded media documents
   */
  uploadMedias(
    memorial: MemorialDocument,
    files: Express.Multer.File[],
  ): Promise<MediaItem[]>;

  /**
   * Deletes a media file from a memorial
   *
   * @param memorial - The memorial document
   * @param mediaId - The ID of the media to delete
   */
  deleteMediaFile(memorial: MemorialDocument, mediaId: string): Promise<void>;
}

export const MemorialsServiceInterface = Symbol("MemorialsServiceInterface");
