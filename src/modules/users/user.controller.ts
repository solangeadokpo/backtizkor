import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiResponseSchema } from "src/common/decorators/responses/api-response.decorator";
import { UserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  JsonResponse,
  PaginationResource,
} from "src/common/interfaces/json-response.interface";
import { successResponse } from "src/common/utils/json-response.helper";
import {
  IUsersService,
  UsersServiceInterface,
} from "./services/users-service.interface";
import { Inject } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { Roles } from "src/common/decorators/metadata/roles.decorator";
import { AppRole } from "src/common/constants/roles.constant";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { PaginationQuery } from "src/common/decorators/requests/pagination-query.decorator";

@Controller({ path: "users", version: "1" })
@ApiTags("Users")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
export class UserController {
  constructor(
    @Inject(UsersServiceInterface) private readonly userService: IUsersService,
  ) {}

  @Post()
  @ApiResponseSchema(UserDto)
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async createUser(@Body() dto: CreateUserDto): Promise<JsonResponse<UserDto>> {
    const userDoc = await this.userService.create(dto);
    return successResponse(
      plainToInstance(UserDto, userDoc.toObject ? userDoc.toObject() : userDoc),
      "User created successfully",
    );
  }

  @Get()
  @ApiResponseSchema(UserDto)
  @PaginationQuery()
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<JsonResponse<PaginationResource<UserDto>>> {
    const paginatedResult = await this.userService.findAll(page, limit);
    const paginatedUserDtos: PaginationResource<UserDto> = {
      ...paginatedResult,
      items: plainToInstance(UserDto, paginatedResult.items),
    };
    return successResponse(paginatedUserDtos, "Users fetched successfully");
  }

  @Get(":id")
  @UsePipes(ParseObjectIdPipe)
  @ApiResponseSchema(UserDto)
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async findOne(@Param("id") id: string): Promise<JsonResponse<UserDto>> {
    const userDoc = await this.userService.findById(id);
    return successResponse(
      plainToInstance(UserDto, userDoc),
      "User fetched successfully",
    );
  }

  @Put(":id")
  @UsePipes(ParseObjectIdPipe)
  @ApiResponseSchema(UserDto)
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<JsonResponse<UserDto>> {
    const userDoc = await this.userService.update(id, dto);
    return successResponse(
      plainToInstance(UserDto, userDoc.toObject ? userDoc.toObject() : userDoc),
      "User updated successfully",
    );
  }

  @Delete(":id")
  @UsePipes(ParseObjectIdPipe)
  @ApiResponseSchema(UserDto)
  @Roles(AppRole.ADMIN, AppRole.SUPERADMIN)
  async delete(@Param("id") id: string): Promise<JsonResponse<UserDto>> {
    const userDoc = await this.userService.delete(id);
    return successResponse(
      plainToInstance(UserDto, userDoc),
      "User deleted successfully",
    );
  }
}
