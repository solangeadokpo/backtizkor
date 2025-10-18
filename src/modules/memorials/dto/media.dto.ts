import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { MediaType } from "src/common/constants/enums/media-type.enum";
import { BaseCrudDto } from "src/core/services/crud/base-crud.dto";

@Exclude()
export class MediaDto extends BaseCrudDto {
  @Expose()
  @ApiProperty({
    description: "The URL of the media file",
    example: "https://example.com/media/profile.jpg",
  })
  url: string;

  @Expose()
  @ApiProperty({
    description: "The type of the media file",
    example: "image",
  })
  type: MediaType;
}

@Exclude()
export class UploadMediaDto {
  @Expose()
  @ApiProperty({
    type: String,
    format: "binary",
    description: "Profile media file (image)",
  })
  file: any;
}

@Exclude()
export class MultiUploadMediaDto {
  @Expose()
  @ApiProperty({
    type: [String],
    format: "binary",
    description: "Profile media file (image)",
  })
  files: any[];
}
