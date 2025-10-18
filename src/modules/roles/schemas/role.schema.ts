import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RoleDocument = Role & Document;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [String], required: true })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
