import { applyDecorators, Type } from "@nestjs/common";
import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { ApiErrorResponses } from "./api-error-response.decorator";

/**
 * Decorator to define a standard API response structure for a list of items.
 * @param model The model type to be used in the response schema.
 * @returns A decorator that applies Swagger API response metadata.
 */
export const ApiResponseSchema = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: "Requête réussie",
      schema: {
        allOf: [
          {
            properties: {
              status_code: { type: "number", example: 200 },
              timestamp: { type: "string", format: "date-time" },
              message: { type: "string", example: "Operation successful" },
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
    ApiErrorResponses(),
  );
};

/**
 * Decorator to define a standard API response structure for a list of items.
 * @param model The model type to be used in the response schema.
 * @returns A decorator that applies Swagger API response metadata for a list of items.
 */
export const ApiResponseListSchema = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: "Requête réussie",
      schema: {
        allOf: [
          {
            properties: {
              status_code: { type: "number", example: 200 },
              timestamp: { type: "string", format: "date-time" },
              message: { type: "string", example: "Operation successful" },
              data: {
                type: "object",
                properties: {
                  total: { type: "number", example: 200 },
                  page: { type: "number", example: 1 },
                  perPage: { type: "number", example: 10 },
                  items: {
                    type: "array",
                    items: {
                      $ref: getSchemaPath(model),
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
    ApiErrorResponses(),
  );
};
