import { Module } from "@nestjs/common";
import { TestimonialsService } from "./services/testimonials.service";
import { TestimonialsController } from "./testimonials.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";
import { MemorialsModule } from "../memorials/memorials.module";
import { JwtProviderModule } from "src/core/services/jwt/jwt.module";
import { Testimonial, TestimonialSchema } from "./schemas/testimonial.schema";
import { FamilyMembersModule } from "../family-members/family-members.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
    UsersModule,
    MemorialsModule,
    JwtProviderModule,
    FamilyMembersModule,
  ],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
  exports: [MongooseModule],
})
export class TestimonialsModule {}
