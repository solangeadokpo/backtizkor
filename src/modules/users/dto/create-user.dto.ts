import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from "class-validator";
import { AppRole } from "src/common/constants/roles.constant";

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "John",
    description: "First name of the user",
    required: false,
  })
  first_name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "Doe",
    description: "Last name of the user",
    required: false,
  })
  last_name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "zehout_1234567890",
    description: "Unique identifier for the user in Zehout system",
    required: false,
  })
  zehout_id?: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "+1234567890",
    description: "Phone number of the user",
    required: true,
  })
  phone_number: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date of birth of the user",
    required: false,
  })
  birth_date?: Date;

  @Expose()
  @IsOptional()
  @IsEnum(AppRole)
  @ApiProperty({
    example: "admin",
    description: "Role of the user in the system",
    enum: Object.values(AppRole),
    required: false,
  })
  role?: AppRole;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: "Timestamp of the last login, managed by the system.",
    readOnly: true,
    required: false,
    type: Date,
  })
  last_login?: Date;
}
