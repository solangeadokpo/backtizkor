import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { CemeteryDto } from "./cemetery.dto";
import { RelationshipType } from "src/common/constants/enums/relationship-type.enum";

@Exclude()
export class DefunctDto {
  @Expose()
  @ApiProperty({
    description: "First name of the defunct",
    example: "John",
    required: true,
  })
  @IsString()
  @MinLength(1)
  first_name: string;

  @Expose()
  @ApiProperty({
    description: "Last name of the defunct",
    example: "Doe",
    required: true,
  })
  @IsString()
  @MinLength(1)
  last_name: string;

  @Expose()
  @ApiProperty({
    description: "Relation of the defunct to the memorial",
    example: "spouse",
    enum: RelationshipType,
    required: false,
  })
  @IsOptional()
  relation?: RelationshipType;

  @Expose()
  @ApiProperty({
    description: "Date of birth of the defunct",
    example: "1990-01-01",
    required: true,
    type: String,
    format: "date",
  })
  @IsDateString()
  birth_date: string;

  @Expose()
  @ApiProperty({
    description: "Date of death of the defunct",
    example: "2020-01-01",
    required: true,
  })
  @IsDateString()
  death_date: string;

  @Expose()
  @ApiPropertyOptional({
    description: "Hebraic date of death of the defunct",
    example: "21 Sivan 5785",
    required: true,
  })
  @IsOptional()
  hebraic_death_date: string;

  @Expose()
  @ApiProperty({
    description: "Cemetry",
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CemeteryDto)
  cemetery: CemeteryDto;
}
