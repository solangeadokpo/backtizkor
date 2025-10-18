import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MemorialWhitelistDocument = MemorialWhitelist & Document;

@Schema({ timestamps: true, collection: "memorials" })
export class MemorialWhitelist {
  @Prop({ type: Types.ObjectId, required: true, ref: "Memorial" })
  memorial_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  user_id?: Types.ObjectId;

  @Prop({ type: Date, default: null })
  last_accessed_at?: Date;
}

export const MemorialWhitelistSchema =
  SchemaFactory.createForClass(MemorialWhitelist);
