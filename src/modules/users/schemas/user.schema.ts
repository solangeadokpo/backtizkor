import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, model, Types } from "mongoose";
import { UserStatus } from "../user-status.enum";

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: "users" })
export class User {
  @Prop({ name: "phone_number", required: true, unique: true })
  phone_number: string;

  @Prop({ name: "zehout_id", unique: true, sparse: true })
  zehout_id?: string;

  @Prop({ name: "first_name", default: null })
  first_name?: string;

  @Prop({ name: "last_name", default: null })
  last_name?: string;

  @Prop({ name: "birth_date", default: null })
  birth_date?: Date;

  @Prop({ type: Types.ObjectId, ref: "Role", required: true })
  role: Types.ObjectId;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ name: "deleted_at", default: null })
  deletedAt?: Date;

  @Prop({ name: "last_login", default: null })
  last_login?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = model(User.name, UserSchema);
