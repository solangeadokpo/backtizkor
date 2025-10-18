import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  UsePipes,
  Inject,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
} from "@nestjs/swagger";
import { FamilyMemberDto } from "./dto/family-member.dto";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { AuthGuard } from "src/common/guards/auth.guard";
import {
  JsonResponse,
  PaginationResource,
} from "src/common/interfaces/json-response.interface";
import {
  ApiResponseListSchema,
  ApiResponseSchema,
} from "src/common/decorators/responses/api-response.decorator";
import { AppRole } from "src/common/constants/roles.constant";
import { Roles } from "src/common/decorators/metadata/roles.decorator";
import { successResponse } from "src/common/utils/json-response.helper";
import { plainToInstance } from "class-transformer";
import { CreateFamilyMemberDto } from "./dto/create-family-member.dto";
import { PaginationQuery } from "src/common/decorators/requests/pagination-query.decorator";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { MemorialDocument } from "../memorials/schemas/memorial.schema";
import { ParseMemorialPipe } from "../memorials/pipes/parse-memorial.pipe";
import { UpdateFamilyMemberDto } from "./dto/update-family-member.dto";
import {
  FamilyMemberServiceInterface,
  IFamilyMemberService,
} from "./services/family-member-service.interface";

@ApiTags("Memorials > Family Members")
@Controller({ path: "", version: "1" })
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
export class FamilyMembersController {
  constructor(
    @Inject(FamilyMemberServiceInterface)
    private readonly service: IFamilyMemberService,
  ) {}

  @Post("memorials/:memorialId/family-members")
  @ApiOperation({ summary: "Add a family member to a memorial" })
  @ApiResponseSchema(FamilyMemberDto)
  @ApiParam({ name: "memorialId", type: String, required: true })
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async addMember(
    @Param("memorialId", ParseMemorialPipe) memorial: MemorialDocument,
    @Body() dto: CreateFamilyMemberDto,
  ): Promise<JsonResponse<FamilyMemberDto>> {
    const memberDoc = await this.service.addMember(memorial, dto);

    return successResponse(
      plainToInstance(FamilyMemberDto, memberDoc),
      "Member added successfully",
    );
  }

  @Get("memorials/:memorialId/family-members")
  @ApiOperation({ summary: "Get all family members for a memorial" })
  @ApiResponseListSchema(FamilyMemberDto)
  @PaginationQuery()
  @ApiParam({ name: "memorialId", type: String, required: true })
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param("memorialId", ParseMemorialPipe) memorial: MemorialDocument,
  ): Promise<JsonResponse<PaginationResource<FamilyMemberDto>>> {
    const paginatedResult = await this.service.findAllByMemorialId(
      page,
      limit,
      memorial.id,
    );
    const paginatedFamilyMemberDtos: PaginationResource<FamilyMemberDto> = {
      ...paginatedResult,
      items: plainToInstance(FamilyMemberDto, paginatedResult.items),
    };

    return successResponse(
      paginatedFamilyMemberDtos,
      "Family members fetched successfully",
    );
  }

  @Put("family-members/:id")
  @ApiResponseSchema(FamilyMemberDto)
  @ApiOperation({ summary: "Update a family member" })
  @ApiParam({ name: "memorialId", type: String, required: true })
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateFamilyMemberDto,
  ): Promise<JsonResponse<FamilyMemberDto>> {
    const memorialDoc = await this.service.update(id, dto);

    return successResponse(
      plainToInstance(FamilyMemberDto, memorialDoc),
      "Member updated successfully",
    );
  }

  @Delete("family-members/:id")
  @UsePipes(ParseObjectIdPipe)
  @ApiOperation({ summary: "Delete a family member" })
  @ApiResponseSchema(FamilyMemberDto)
  @ApiParam({ name: "memorialId", type: String, required: true })
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async delete(@Param("id") id: string): Promise<JsonResponse<null>> {
    await this.service.softRemove(id);

    return successResponse(null, "Member deleted successfully");
  }
}
