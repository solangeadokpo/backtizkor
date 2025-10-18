import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsEnum,
  IsMongoId,
  ValidateNested,
} from "class-validator";
import { Types } from "mongoose";
import { RelationshipType } from "src/common/constants/enums/relationship-type.enum";
import { NoDuplicateUserIds } from "src/common/decorators/validators/no-duplicate-user-ids.validator";

@Exclude()
export class CreateFamilyMemberDto {
  @ApiProperty({
    type: String,
    required: true,
    description: "The ObjectId of the user",
    example: "60d21b4667d0d8992e610c85",
  })
  @Expose()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  member: string;

  @ApiProperty({
    enum: RelationshipType,
    required: true,
    description: "The relation of the family member",
    example: "sibling",
  })
  @Expose()
  @IsEnum(RelationshipType)
  relation: string;
}

@Exclude()
export class AddManyFamilyMemberDto {
  @Expose()
  @ApiProperty({
    description: "List of family members associated with the memorial",
    required: true,
    type: [CreateFamilyMemberDto],
  })
  @ArrayMinSize(1, {
    message: "family_members must contain at least one item.",
  })
  @NoDuplicateUserIds({
    message: "Each family member must have a unique user_id",
  })
  @ValidateNested({ each: true })
  @Type(() => CreateFamilyMemberDto)
  family_members: CreateFamilyMemberDto[];
}
