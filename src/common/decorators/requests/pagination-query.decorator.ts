import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function PaginationQuery() {
  return applyDecorators(
    ApiQuery({
      name: "page",
      required: false,
      type: Number,
      example: 1,
      default: 1,
      description: "Page number for pagination",
    }),
    ApiQuery({
      name: "limit",
      required: false,
      type: Number,
      example: 10,
      default: 10,
      description: "Number of items per page for pagination",
    }),
  );
}
