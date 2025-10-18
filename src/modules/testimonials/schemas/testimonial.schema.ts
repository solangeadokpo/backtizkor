import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true, collection: "testimonials" })
export class Testimonial {
  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  user?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Memorial", required: true })
  memorial: Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);

function autoPopulateMember(this: any, next: () => void) {
  this.populate("user");
  next();
}

TestimonialSchema.pre("find", autoPopulateMember)
  .pre("findOne", autoPopulateMember)
  .pre("findOneAndUpdate", autoPopulateMember)
  .pre("save", autoPopulateMember);
