import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

@Exclude()
export class CreateTestimonialDto {
  @Expose()
  @ApiProperty({
    description: "The content of the testimony",
    example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  })
  @IsString()
  @MinLength(50)
  message: string;

  @Expose()
  @ApiProperty({
    description: "Define if the testimony is anonymous or not",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
