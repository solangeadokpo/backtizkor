import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MemorialType, MemorialStatus } from "../enums/memorial.enum";
import { generateMemorialReference } from "src/common/utils/reference.util";
import { UserContextService } from "src/core/services/user-contexte.service";
import { Defunct } from "./defunct.schema";
import { HDate } from "@hebcal/core";
import { MediaItem, MediaItemDocument, MediaItemSchema } from "./media.schema";

export type MemorialDocument = Memorial & Document;

@Schema({ timestamps: true, collection: "memorials" })
export class Memorial {
  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: false, default: null })
  profile?: string;

  @Prop({
    type: [Defunct],
    required: true,
    default: [],
    validate: {
      validator: function (val: any[]) {
        return val.length >= 1 && val.length <= 2;
      },
      message: "The number of defuncts must be between 1 and 2.",
    },
  })
  defuncts: Defunct[];

  @Prop({ type: [MediaItemSchema], default: [] })
  medias?: MediaItemDocument[];

  @Prop({ type: String, default: null })
  short_biography?: string;

  @Prop({ required: false, default: null })
  long_biography?: string;

  @Prop({ type: String, default: null })
  external_link?: string;

  @Prop({ enum: MemorialType, required: true })
  type: MemorialType;

  @Prop({ type: Number, default: 0 })
  likes?: number;

  @Prop({
    enum: MemorialStatus,
    required: true,
    default: MemorialStatus.ACTIVE,
  })
  status: MemorialStatus;

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  created_by: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const MemorialSchema = SchemaFactory.createForClass(Memorial);

MemorialSchema.pre<MemorialDocument>("validate", function (next) {
  if (this.isNew && !this.reference) {
    this.reference = generateMemorialReference();
  }

  if (this.isNew && !this.created_by) {
    const currentUserId = UserContextService.getCurrentUserId();
    if (currentUserId) {
      this.created_by = new Types.ObjectId(currentUserId);
    }
  }

  this.defuncts.forEach((defunct) => {
    if (defunct.death_date) {
      defunct.hebraic_death_date = convertToHebrewString(defunct.death_date);
    }
  });

  next();
});

function convertToHebrewString(date: Date): string {
  const hebrewDate = new HDate(date);
  return `${hebrewDate.getDate()} ${hebrewDate.getMonthName()} ${hebrewDate.getFullYear()}`;
}
