import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { IMemorialsService } from "../interfaces/memorial-service.interface";
import { Memorial, MemorialDocument } from "../schemas/memorial.schema";
import { CreateMemorialDto } from "../dto/create-memorial.dto";
import { UpdateMemorialDto } from "../dto/update-memorial.dto";
import { MongoCrudService } from "src/core/services/crud/implementations/mongo-crud.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PaginationResource } from "src/common/interfaces/json-response.interface";
import { UserContextService } from "src/core/services/user-contexte.service";
import {
  FileStoreServiceInterface,
  IFileStoreService,
} from "src/core/services/filestore/filestore-service.interface";
import { getMediaType } from "src/common/constants/enums/media-type.enum";
import { MediaItem, MediaItemDocument } from "../schemas/media.schema";

@Injectable()
export class MemorialsService
  extends MongoCrudService<
    MemorialDocument,
    CreateMemorialDto,
    UpdateMemorialDto
  >
  implements IMemorialsService
{
  private readonly logger = new Logger(MemorialsService.name);

  constructor(
    @InjectModel(Memorial.name) private userModel: Model<MemorialDocument>,
    @Inject(FileStoreServiceInterface)
    private readonly fileService: IFileStoreService,
  ) {
    super(userModel);
  }

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<PaginationResource<MemorialDocument & { hasLiked: boolean }>> {
    const skip = (page - 1) * perPage;
    const findQuery = { deletedAt: null };

    const total = await this.model.countDocuments(findQuery);

    const items = await this.model.aggregate([
      { $match: findQuery },
      {
        $lookup: {
          from: "memorial_likes",
          let: { memorialId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$memorial", "$$memorialId"] },
                    {
                      $eq: [
                        "$user",
                        new Types.ObjectId(
                          UserContextService.getCurrentUserId(),
                        ),
                      ],
                    },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "likeMatch",
        },
      },
      {
        $addFields: {
          hasLiked: { $gt: [{ $size: "$likeMatch" }, 0] },
        },
      },
      {
        $project: {
          likeMatch: 0,
        },
      },
      { $skip: skip },
      { $limit: perPage },
    ]);

    return {
      total,
      page,
      perPage,
      items,
    };
  }

  async updateLikesCount(
    memorialId: string,
    increment: boolean = true,
  ): Promise<MemorialDocument> {
    const updated = await this.model.findOneAndUpdate(
      { _id: memorialId, deletedAt: null },
      { $inc: { likes: increment ? 1 : -1 } },
      { new: true },
    );

    if (!updated)
      throw new NotFoundException(
        `${this.model.name} with id ${memorialId} not found`,
      );

    return updated;
  }

  async uploadProfileMedia(
    memorial: MemorialDocument,
    file: Express.Multer.File,
  ): Promise<MemorialDocument> {

    const url = await this.fileService.uploadFile(
      file.buffer,
      this.getMediaFilename(memorial.id, file, true),
      file.mimetype,
    );
    // Delete existing profile media if it exists
    if (memorial.profile) {
      await this.fileService.deleteFile(memorial.profile);
    }

    memorial.profile = url;
    memorial.markModified("profile");

    const updatedMemorial = await memorial.save();

    return updatedMemorial;
  }

  async uploadMedias(
    memorial: MemorialDocument,
    files: Express.Multer.File[],
  ): Promise<MediaItem[]> {
    for (const file of files) {
      const url = await this.fileService.uploadFile(
        file.buffer,
        this.getMediaFilename(memorial.id, file),
        file.mimetype,
      );

      memorial.medias?.push({
        url,
        type: getMediaType(file.mimetype),
      } as MediaItemDocument);
    }
    memorial.markModified("medias");

    const updatedMemorial = await memorial.save();

    return updatedMemorial.medias ?? [];
  }

  async deleteMediaFile(
    memorial: MemorialDocument,
    mediaId: string,
  ): Promise<void> {
    const media = memorial.medias?.find((media) =>
      (media as any)._id.equals(new Types.ObjectId(mediaId)),
    );

    if (!media) {
      throw new NotFoundException(`Media with id ${mediaId} not found`);
    }

    await this.fileService.deleteFile(media.url);

    memorial.medias =
      memorial.medias?.filter(
        (media) => !(media as any)._id.equals(new Types.ObjectId(mediaId))
      ) || [];
    memorial.markModified("medias");

    return memorial.save().then(() => {});
  }

  /**
   * Generates a unique filename for a media file based on the memorial ID and current timestamp.
   * @param memorialId - The ID of the memorial.
   * @param file - The media file being uploaded.
   * @returns A string representing the unique filename.
   */
  private getMediaFilename(
    memorialId: string,
    file: Express.Multer.File,
    profile: boolean = false,
  ): string {
    const timestamp = Date.now();
    const extension = file.originalname.split(".").pop() || "";
    return `memorials/${memorialId}/${
      profile ? "profile" : "medias"
    }/${timestamp}.${extension}`;
  }
}
