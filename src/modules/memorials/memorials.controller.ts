import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Inject,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  Patch,
  BadRequestException,
  UploadedFiles,
} from "@nestjs/common";
import { CreateMemorialDto } from "./dto/create-memorial.dto";
import { UpdateMemorialDto } from "./dto/update-memorial.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import {
  ApiResponseListSchema,
  ApiResponseSchema,
} from "src/common/decorators/responses/api-response.decorator";
import {
  IMemorialsService,
  MemorialsServiceInterface,
} from "./interfaces/memorial-service.interface";
import {
  JsonResponse,
  PaginationResource,
} from "src/common/interfaces/json-response.interface";
import { MemorialDto } from "./dto/memorial.dto";
import { Roles } from "src/common/decorators/metadata/roles.decorator";
import { AppRole } from "src/common/constants/roles.constant";
import { successResponse } from "src/common/utils/json-response.helper";
import { plainToInstance } from "class-transformer";
import { PaginationQuery } from "src/common/decorators/requests/pagination-query.decorator";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { MemorialAccessGuard } from "src/common/guards/memorial-access.guard";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ParseMemorialPipe } from "./pipes/parse-memorial.pipe";
import { MemorialDocument } from "./schemas/memorial.schema";
import { MediaItem } from "./schemas/media.schema";
import { MediaDto, MultiUploadMediaDto, UploadMediaDto } from "./dto/media.dto";
import { isRequiredFileType } from "src/common/decorators/validators/required-file-type";
import { MediaType } from "src/common/constants/enums/media-type.enum";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = Number(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = Number(process.env.MAX_VIDEO_SIZE) || 20 * 1024 * 1024; // 20MB

@Controller({ path: "memorials", version: "1" })
@ApiTags("Memorials")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
export class MemorialsController {
  constructor(
    @Inject(MemorialsServiceInterface)
    private readonly memorialsService: IMemorialsService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a memorial" })
  @ApiResponseSchema(MemorialDto)
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async createMemorial(
    @Body() dto: CreateMemorialDto,
  ): Promise<JsonResponse<MemorialDto>> {
    const memorialDoc = await this.memorialsService.create(dto);

    return successResponse(
      plainToInstance(
        MemorialDto,
        memorialDoc.toObject ? memorialDoc.toObject() : memorialDoc,
      ),
      "Memorial created successfully",
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all memorials" })
  @ApiResponseListSchema(MemorialDto)
  @PaginationQuery()
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<JsonResponse<PaginationResource<MemorialDto>>> {
    const paginatedResult = await this.memorialsService.findAll(page, limit);
    const paginatedMemorialDtos: PaginationResource<MemorialDto> = {
      ...paginatedResult,
      items: plainToInstance(MemorialDto, paginatedResult.items),
    };
    return successResponse(
      paginatedMemorialDtos,
      "Memorials fetched successfully",
    );
  }

  @Get(":id")
  @UsePipes(ParseObjectIdPipe)
  @UseGuards(MemorialAccessGuard)
  @ApiOperation({ summary: "Get a memorial by ID" })
  @ApiResponseSchema(MemorialDto)
  async findOne(@Param("id") id: string): Promise<JsonResponse<MemorialDto>> {
    const memorialDoc = await this.memorialsService.findOne(id);
    return successResponse(
      plainToInstance(MemorialDto, memorialDoc),
      "Memorial fetched successfully",
    );
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a memorial" })
  @ApiResponseSchema(MemorialDto)
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateMemorialDto,
  ): Promise<JsonResponse<MemorialDto>> {
    const memorialDoc = await this.memorialsService.update(id, dto);
    return successResponse(
      plainToInstance(
        MemorialDto,
        memorialDoc.toObject ? memorialDoc.toObject() : memorialDoc,
      ),
      "Memorial updated successfully",
    );
  }

  @Delete(":id")
  @UsePipes(ParseObjectIdPipe)
  @ApiOperation({ summary: "Delete a memorial" })
  @ApiResponseSchema(MemorialDto)
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async delete(@Param("id") id: string): Promise<JsonResponse<null>> {
    await this.memorialsService.softRemove(id);
    return successResponse(null, "Memorial deleted successfully");
  }

  @Patch(":id/profile")
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ summary: "Upload a profile media" })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: isRequiredFileType(MediaType.IMAGE),
    }),
  )
  async uploadProfileMedia(
    @Param("id", ParseMemorialPipe) memorial: MemorialDocument,
    @Body() _: UploadMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<JsonResponse<MemorialDto>> {
    if (!file) {
      throw new BadRequestException("No file provided or invalid.");
    }

    const updatedMemorial = await this.memorialsService.uploadProfileMedia(
      memorial,
      file,
    );
    return successResponse(
      plainToInstance(MemorialDto, updatedMemorial),
      "Profile photo uploaded successfully",
    );
  }

  @Patch(":id/medias")
  @ApiOperation({ summary: "Upload multiple media files" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "id", type: String, required: true })
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      fileFilter: isRequiredFileType(MediaType.IMAGE, MediaType.VIDEO),
      limits: {
        fileSize: MAX_VIDEO_SIZE,
      },
    }),
  )
  async uploadMediaFiles(
    @Param("id", ParseMemorialPipe) memorial: MemorialDocument,
    @Body() _: MultiUploadMediaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<JsonResponse<MediaDto[]>> {
    if (!files || files.length === 0) {
      throw new BadRequestException("No file provided.");
    }

    for (const file of files) {
      const isImage = /^image\//.test(file.mimetype);

      const limit = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

      if (file.size > limit) {
        throw new BadRequestException(
          `The file "${file.originalname}" exceeds the maximum allowed size of ${Math.floor(limit / 1024 / 1024)}MB.`,
        );
      }
    }

    const uploadedFiles = await this.memorialsService.uploadMedias(
      memorial,
      files,
    );

    return successResponse(
      plainToInstance(MediaDto, uploadedFiles),
      "Media files uploaded successfully",
    );
  }

  @Get(":id/medias")
  @ApiOperation({ summary: "Get all media files for a memorial" })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiResponseSchema(Array<MediaDto>)
  async getMediaFiles(
    @Param("id", ParseMemorialPipe) memorial: MemorialDocument,
  ): Promise<JsonResponse<MediaDto[]>> {
    return successResponse(
      plainToInstance(
        MediaDto,
        memorial.medias ?? [],
      ),
      "Media files retrieved successfully",
    );
  }

  @Delete(":id/medias/:mediaId")
  @ApiOperation({ summary: "Delete a media file from a memorial" })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiParam({ name: "mediaId", type: String, required: true })
  async deleteMediaFile(
    @Param("id", ParseMemorialPipe) memorial: MemorialDocument,
    @Param("mediaId", ParseObjectIdPipe) mediaId: string,
  ): Promise<JsonResponse<null>> {
    await this.memorialsService.deleteMediaFile(memorial, mediaId);
    return successResponse(null, "Media file deleted successfully");
  }
}
