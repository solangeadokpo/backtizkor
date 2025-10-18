import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Cemetery } from "./cemetery.schema";

@Schema()
export class Defunct {
  @Prop({ type: Types.ObjectId, required: false, default: null, ref: "User" })
  user_id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  first_name: string;

  @Prop({ type: String, required: true })
  last_name: string;

  @Prop({ type: String, required: true })
  relation: string;

  @Prop({ type: Date, required: true })
  birth_date: Date;

  @Prop({ type: Date, required: true })
  death_date: Date;

  @Prop({ type: String, required: true })
  hebraic_death_date: string;

  @Prop({ type: Cemetery, required: true })
  cemetery: Cemetery;
}
