import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UsePipes,
  Put,
} from "@nestjs/common";
import { TestimonialsService } from "./services/testimonials.service";
import { CreateTestimonialDto } from "./dto/create-testimonial.dto";
import { UpdateTestimonialDto } from "./dto/update-testimonial.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import {
  ApiResponseListSchema,
  ApiResponseSchema,
} from "src/common/decorators/responses/api-response.decorator";
import { TestimonialDto } from "./dto/testimonial.dto";
import {
  JsonResponse,
  PaginationResource,
} from "src/common/interfaces/json-response.interface";
import { successResponse } from "src/common/utils/json-response.helper";
import { plainToInstance } from "class-transformer";
import { PaginationQuery } from "src/common/decorators/requests/pagination-query.decorator";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { MemorialAccessGuard } from "src/common/guards/memorial-access.guard";
import { ParseMemorialPipe } from "../memorials/pipes/parse-memorial.pipe";
import { MemorialDocument } from "../memorials/schemas/memorial.schema";

@Controller({ path: "", version: "1" })
@ApiTags("Testimonials")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post("memorials/:memorialId/testimonials")
  @ApiOperation({ summary: "Create a testimonial for a memorial" })
  @ApiResponseSchema(TestimonialDto)
  @ApiParam({ name: "memorialId", type: String, required: true })
  async createTestimonial(
    @Param("memorialId", ParseMemorialPipe) memorial: MemorialDocument,
    @Body() dto: CreateTestimonialDto,
  ): Promise<JsonResponse<TestimonialDto>> {
    const testimonialDoc = await this.testimonialsService.createTestimony(
      memorial.id,
      dto,
    );

    return successResponse(
      plainToInstance(TestimonialDto, testimonialDoc),
      "Testimonial created successfully",
    );
  }

  @Get("memorials/:memorialId/testimonials")
  @ApiOperation({ summary: "Get all testimonials for a memorial" })
  @ApiResponseListSchema(TestimonialDto)
  @ApiParam({ name: "memorialId", type: String, required: true })
  @PaginationQuery()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Param("memorialId", ParseMemorialPipe) memorial: MemorialDocument,
  ): Promise<JsonResponse<PaginationResource<TestimonialDto>>> {
    const paginatedResult = await this.testimonialsService.findAllByMemorialId(
      page,
      limit,
      memorial.id,
    );
    const paginatedTestimonialDtos: PaginationResource<TestimonialDto> = {
      ...paginatedResult,
      items: plainToInstance(TestimonialDto, paginatedResult.items),
    };

    return successResponse(
      paginatedTestimonialDtos,
      "Testimonials fetched successfully",
    );
  }

  @Put("testimonials/:id")
  @ApiOperation({ summary: "Update a testimonial" })
  @ApiResponseSchema(TestimonialDto)
  @UseGuards(MemorialAccessGuard)
  async update(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTestimonialDto,
  ): Promise<JsonResponse<TestimonialDto>> {
    const testimonialDoc = await this.testimonialsService.update(id, dto);
    return successResponse(
      plainToInstance(TestimonialDto, testimonialDoc),
      "Testimonial updated successfully",
    );
  }

  @Delete("testimonials/:id")
  @ApiOperation({ summary: "Delete a testimonial" })
  @UseGuards(MemorialAccessGuard)
  @UsePipes(ParseObjectIdPipe)
  @ApiResponseSchema(TestimonialDto)
  async delete(@Param("id") id: string): Promise<JsonResponse<null>> {
    await this.testimonialsService.softRemove(id);
    return successResponse(null, "Testimonial deleted successfully");
  }
}
