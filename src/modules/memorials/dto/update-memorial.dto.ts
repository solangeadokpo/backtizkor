import { PartialType } from "@nestjs/mapped-types";
import { CreateMemorialDto } from "./create-memorial.dto";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { DefunctDto } from "./defunct.dto";
import { ArrayMaxSize, ArrayMinSize, ValidateNested } from "class-validator";
import { Optional } from "@nestjs/common";

export class UpdateMemorialDto extends PartialType(CreateMemorialDto) {
  @Expose()
  @ApiProperty({
    description: "List of defuncts associated with the memorial",
    required: true,
    type: [DefunctDto],
  })
  @Optional()
  @ArrayMinSize(1, { message: "defuncts must contain at least one item." })
  @ArrayMaxSize(2, { message: "defuncts cannot contain more than two items." })
  @ValidateNested({ each: true })
  @Type(() => DefunctDto)
  defuncts: DefunctDto[];
}
