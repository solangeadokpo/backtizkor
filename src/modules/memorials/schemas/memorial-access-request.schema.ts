import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum AccessRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  REVOKED = "REVOKED",
}

export enum AccessType {
  TEMPORARY = "TEMPORARY",
  PERMANENT = "PERMANENT",
}

export type MemorialAccessRequestDocument = MemorialAccessRequest & Document;

@Schema({ timestamps: true, collection: "memorial_access_requests" })
export class MemorialAccessRequest {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  requester: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Memorial", required: true })
  memorial: Types.ObjectId;

  @Prop({
    type: String,
    enum: AccessRequestStatus,
    default: AccessRequestStatus.PENDING,
  })
  status: AccessRequestStatus;

  @Prop({ type: String, default: null })
  message?: string;

  @Prop({ type: Date, default: null })
  respondedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: "User" })
  respondedBy?: Types.ObjectId;

  @Prop({
    type: String,
    enum: AccessType,
    default: null,
  })
  accessType?: AccessType;

  @Prop({ type: Date, default: null })
  expiresAt?: Date;

  @Prop({ type: String, default: null })
  accessToken?: string;

  @Prop({ type: String, default: null })
  phoneNumber?: string;

  @Prop({ type: Boolean, default: false })
  isWhitelisted?: boolean;

  @Prop({ type: Boolean, default: false })
  hasVisited?: boolean;
}

export const MemorialAccessRequestSchema = SchemaFactory.createForClass(
  MemorialAccessRequest,
);

MemorialAccessRequestSchema.index(
  { requester: 1, memorial: 1 },
  {
    unique: true,
    partialFilterExpression: { status: AccessRequestStatus.PENDING },
  },
);
