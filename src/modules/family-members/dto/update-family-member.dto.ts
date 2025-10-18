import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEnum } from "class-validator";
import { RelationshipType } from "src/common/constants/enums/relationship-type.enum";

@Exclude()
export class UpdateFamilyMemberDto {
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
