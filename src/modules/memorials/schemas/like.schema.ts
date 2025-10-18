import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { UserContextService } from "src/core/services/user-contexte.service";

export type LikeDocument = Like & Document;

@Schema({ timestamps: true, collection: "memorial_likes" })
export class Like {
  @Prop({ type: Types.ObjectId, ref: "Memorial", required: true })
  memorial: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ user: 1, memorial: 1 }, { unique: true });

LikeSchema.pre<LikeDocument>("validate", function (next) {
  if (this.isNew) {
    const currentUserId = UserContextService.getCurrentUserId();
    if (currentUserId) {
      this.user = new Types.ObjectId(currentUserId);
    }
  }

  next();
});
