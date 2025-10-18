import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { RelationshipType } from "src/common/constants/enums/relationship-type.enum";

export type FamilyMemberDocument = FamilyMember & Document;

@Schema({ timestamps: true, collection: "family_members" })
export class FamilyMember {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  member: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Memorial", required: true })
  memorial: Types.ObjectId;

  @Prop({ type: String, enum: RelationshipType })
  relation: RelationshipType;

  @Prop({ type: Types.ObjectId, ref: "User" })
  added_by: Types.ObjectId;
}

export const FamilyMemberSchema = SchemaFactory.createForClass(FamilyMember);

FamilyMemberSchema.index({ member: 1, memorial: 1 }, { unique: true });

function autoPopulateMember(this: any, next: () => void) {
  this.populate("member");
  next();
}

FamilyMemberSchema.pre("find", autoPopulateMember)
  .pre("findOne", autoPopulateMember)
  .pre("findOneAndUpdate", autoPopulateMember)
  .pre("findOne", autoPopulateMember);
