import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { BaseCrudDto } from "src/core/services/crud/base-crud.dto";
import { UserDto } from "src/modules/users/dto/user.dto";

@Exclude()
export class TestimonialDto extends BaseCrudDto {
  @Expose()
  @ApiProperty({
    description:
      "The user that create the testimony, can be null if it's anonymous",
    type: UserDto,
  })
  @Type(() => UserDto)
  user?: UserDto;

  @Expose()
  @ApiProperty({
    description: "The content of the testimony",
    example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  })
  message: string;
}
