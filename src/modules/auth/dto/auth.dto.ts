import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { UserDto } from "src/modules/users/dto/user.dto";

@Exclude()
export class AuthDto {
  @Expose()
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY........",
    description: "Access token for authenticated user",
  })
  access_token: string;

  @Expose()
  @ApiProperty({
    example: 3600,
    description: "Time in seconds until the access token expires",
  })
  expires_in: number;

  @Expose()
  @ApiProperty({
    example: "Bearer",
    description: 'Type of the token, typically "Bearer"',
  })
  token_type: string;

  @Expose()
  @ApiProperty({
    type: UserDto,
    description: "Details of the authenticated user",
  })
  @Type(() => UserDto)
  user: UserDto;
}
