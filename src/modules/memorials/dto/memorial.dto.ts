import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { BaseCrudDto } from "src/core/services/crud/base-crud.dto";
import { MemorialStatus, MemorialType } from "../enums/memorial.enum";
import { DefunctDto } from "./defunct.dto";
import { MediaDto } from "./media.dto";

@Exclude()
export class MemorialDto extends BaseCrudDto {
  @Expose()
  @ApiProperty({
    description: "Name for the memorial",
    example: "John Doe Memorial",
    required: true,
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Profile media for the memorial",
    required: false,
  })
  profile: string;

  @Expose()
  @ApiProperty({
    description: "List of defuncts associated with the memorial",
    required: true,
    type: [DefunctDto],
  })
  @Type(() => DefunctDto)
  defuncts: DefunctDto[];

  @Expose()
  @ApiProperty({
    description: "Short biography of the memorial",
    example: "In loving memory of John Doe",
    required: false,
  })
  short_biography?: string;

  @Expose()
  @ApiProperty({
    description: "Long biography of the memorial",
    example: "John Doe was a beloved member of the community...",
    required: false,
  })
  long_biography?: string;

  @Expose()
  @ApiProperty({
    description: "External link for the memorial",
    example: "https://example.com/john-doe-memorial",
    required: false,
  })
  external_link?: string;

  @Expose()
  @ApiProperty({
    description: "Type of the memorial",
    example: "private",
    required: true,
    enum: Object.values(MemorialType),
  })
  type: MemorialType;

  @Expose()
  @ApiProperty({
    description: "Nb of likes of the memorial",
    example: 130,
    required: true,
  })
  likes: number;

  @Expose()
  @ApiProperty({
    description: "Determines if a user like or not the memorial",
    example: true,
  })
  hasLiked: boolean;

  @Expose()
  @ApiProperty({
    description: "Status of the memorial",
    example: "active",
    required: true,
    enum: Object.values(MemorialStatus),
  })
  status: MemorialStatus;
}
