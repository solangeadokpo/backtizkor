import { Injectable } from "@nestjs/common";
import { CreateTestimonialDto } from "../dto/create-testimonial.dto";
import { UpdateTestimonialDto } from "../dto/update-testimonial.dto";
import { MongoCrudService } from "src/core/services/crud/implementations/mongo-crud.service";
import {
  Testimonial,
  TestimonialDocument,
} from "../schemas/testimonial.schema";
import { ICrudService } from "src/core/services/crud/interfaces/crud-service.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PaginationResource } from "src/common/interfaces/json-response.interface";
import { UserContextService } from "src/core/services/user-contexte.service";

@Injectable()
export class TestimonialsService
  extends MongoCrudService<
    TestimonialDocument,
    CreateTestimonialDto,
    UpdateTestimonialDto
  >
  implements
    ICrudService<
      TestimonialDocument,
      CreateTestimonialDto,
      UpdateTestimonialDto
    >
{
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
  ) {
    super(testimonialModel);
  }

  async createTestimony(
    memorialId: string,
    createDto: CreateTestimonialDto,
  ): Promise<TestimonialDocument> {
    return await this.model.create({
      message: createDto.message,
      memorial: new Types.ObjectId(memorialId),
      user: createDto.isAnonymous
        ? null
        : new Types.ObjectId(UserContextService.getCurrentUserId()),
    });
  }

  async findAllByMemorialId(
    page = 1,
    perPage = 10,
    memorialId: string,
  ): Promise<PaginationResource<TestimonialDocument>> {
    const skip = (page - 1) * perPage;
    const findQuery = {
      memorial: new Types.ObjectId(memorialId),
      deletedAt: null,
    };
    const [total, items] = await Promise.all([
      this.model.countDocuments(findQuery),
      this.model.find(findQuery).skip(skip).limit(perPage),
    ]);

    return {
      total,
      page,
      perPage,
      items,
    };
  }
}
