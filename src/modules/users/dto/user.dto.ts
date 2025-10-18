import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { UserStatus } from "src/modules/users/user-status.enum";
import { BaseCrudDto } from "src/core/services/crud/base-crud.dto";
import { RoleDto } from "src/modules/roles/dto/role.dto";

@Exclude()
export class UserDto extends BaseCrudDto {
  @Expose()
  @ApiProperty({
    example: "John",
    description: "First name of the user",
  })
  first_name: string;

  @Expose()
  @ApiProperty({
    example: "Doe",
    description: "Last name of the user",
  })
  last_name: string;

  @Expose()
  @ApiProperty({
    example: "zehout_1234567890",
    description: "Unique identifier for the user in Zehout system",
  })
  zehout_id: string;

  @Expose()
  @ApiProperty({
    example: "+1234567890",
    description: "Phone number of the user",
  })
  phone_number: string;

  @Expose()
  @ApiProperty({
    example: "active",
    description: "Current status of the user account",
    enum: UserStatus,
  })
  status: UserStatus;

  @Expose()
  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date of birth of the user",
  })
  birth_date: Date;

  @Expose()
  @Type(() => RoleDto)
  @ApiProperty({
    type: RoleDto,
    description: "Role of the user in the system",
  })
  role: RoleDto;

  @Expose()
  @ApiProperty({
    example: null,
    description: "Date when the user was deleted, if applicable",
    nullable: true,
  })
  last_login: Date;
}
