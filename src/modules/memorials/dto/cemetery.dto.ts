import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

@Exclude()
class CoordinatesDto {
  @Expose()
  @ApiProperty({ example: 48.8417, description: "Latitude du cimetière" })
  @IsNumber()
  lat: number;

  @Expose()
  @ApiProperty({ example: 2.3215, description: "Longitude du cimetière" })
  @IsNumber()
  lng: number;
}

@Exclude()
export class CemeteryDto {
  @Expose()
  @ApiProperty({
    example: "Cimetière Montparnasse",
    description: "Nom du cimetière",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @ApiPropertyOptional({
    example: "3 Boulevard Edgar Quinet",
    description: "Adresse du cimetière",
  })
  @IsOptional()
  @IsString()
  address?: string;

  @Expose()
  @ApiProperty({ example: "Paris", description: "Ville du cimetière" })
  @IsString()
  city?: string;

  @Expose()
  @ApiProperty({ example: "FR", description: "Code pays ISO Alpha-2" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @Expose()
  @ApiProperty({
    type: CoordinatesDto,
    description: "Coordonnées géographiques du cimetière",
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;
}
