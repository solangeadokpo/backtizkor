import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

@Exclude()
export class UpdateTestimonialDto {
  @Expose()
  @ApiProperty({
    description: "The content of the testimony",
    example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  })
  @IsString()
  @MinLength(50)
  message: string;
}
