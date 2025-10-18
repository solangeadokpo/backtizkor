import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsEnum } from "class-validator";
import { RelationshipType } from "src/common/constants/enums/relationship-type.enum";
import { BaseCrudDto } from "src/core/services/crud/base-crud.dto";
import { UserDto } from "src/modules/users/dto/user.dto";

@Exclude()
export class FamilyMemberDto extends BaseCrudDto {
  @Expose()
  @Type(() => UserDto)
  member: UserDto;

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
