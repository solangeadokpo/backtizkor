import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { LikesService } from "../memorials/services/likes.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Like } from "../memorials/schemas/like.schema";
import { ApiResponseSchema } from "src/common/decorators/responses/api-response.decorator";
import { JsonResponse } from "src/common/interfaces/json-response.interface";
import { MemorialDocument } from "./schemas/memorial.schema";
import { ParseMemorialPipe } from "./pipes/parse-memorial.pipe";
import { successResponse } from "src/common/utils/json-response.helper";
import { plainToInstance } from "class-transformer";
import { MemorialAccessGuard } from "src/common/guards/memorial-access.guard";
import { MemorialDto } from "./dto/memorial.dto";

@Controller({ path: "memorials/:memorialId/likes", version: "1" })
@ApiTags("Memorials")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard, MemorialAccessGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @ApiOperation({ summary: "Toggle like for a memorial" })
  @ApiResponseSchema(Like)
  @ApiParam({ name: "memorialId", type: String, required: true })
  async add(
    @Param("memorialId", ParseMemorialPipe) memorial: MemorialDocument,
  ): Promise<JsonResponse<MemorialDto>> {
    const memorialDoc = await this.likesService.toggleLike(memorial.id);

    return successResponse(
      plainToInstance(MemorialDto, memorialDoc),
      "Likes updated successfully",
    );
  }
}
