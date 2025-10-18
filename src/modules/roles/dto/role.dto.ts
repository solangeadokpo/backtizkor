import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { BaseCrudDto } from "src/core/services/crud/base-crud.dto";

@Exclude()
export class RoleDto extends BaseCrudDto {
  @Expose()
  @ApiProperty({
    example: "admin",
    description: "Name of the role",
  })
  name: string;
}
