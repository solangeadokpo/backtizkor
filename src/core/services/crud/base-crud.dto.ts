import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class BaseCrudDto {
  @Expose({ name: "id" })
  @Transform(({ obj }) => obj._id?.toString())
  @ApiProperty({
    example: "1234567890abcdef12345678",
    description: "Unique identifier for the user",
  })
  _id: string;

  @Expose()
  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the user was created",
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the user was last updated",
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the user was deleted, if applicable",
  })
  deletedAt: Date;
}
