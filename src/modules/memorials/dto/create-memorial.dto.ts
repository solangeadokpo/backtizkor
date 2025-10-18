import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from "class-validator";
import { MemorialType } from "../enums/memorial.enum";
import { DefunctDto } from "./defunct.dto";

@Exclude()
export class CreateMemorialDto {
  @Expose()
  @ApiProperty({
    description: "Name for the memorial",
    example: "John Doe Memorial",
    required: true,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @Expose()
  @ApiProperty({
    description: "List of defuncts associated with the memorial",
    required: true,
    type: [DefunctDto],
  })
  @ArrayMinSize(1, { message: "defuncts must contain at least one item." })
  @ArrayMaxSize(2, { message: "defuncts cannot contain more than two items." })
  @ValidateNested({ each: true })
  @Type(() => DefunctDto)
  defuncts: DefunctDto[];

  @Expose()
  @ApiProperty({
    description: "Short biography of the memorial",
    example: "In loving memory of John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  short_biography?: string;

  @Expose()
  @ApiProperty({
    description: "Long biography of the memorial",
    example: "John Doe was a beloved member of the community...",
    required: false,
  })
  @IsString()
  @MinLength(20)
  @IsOptional()
  long_biography?: string;

  @Expose()
  @ApiProperty({
    description: "External link for the memorial",
    example: "https://example.com/john-doe-memorial",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  external_link?: string;

  @Expose()
  @ApiProperty({
    description: "Type of the memorial",
    example: "private",
    required: true,
    enum: Object.values(MemorialType),
  })
  @IsEnum(MemorialType)
  type: string;
}
