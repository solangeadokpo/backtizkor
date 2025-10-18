import { applyDecorators } from "@nestjs/common";
import {
  badRequestErrorSchema,
  forbiddenErrorScheema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../../utils/http-error-schemas";
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";

export function ApiErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description:
        "Invalid request - The request sent by the client is incorrect or incomplete.",
      ...badRequestErrorSchema,
    }),
    ApiUnauthorizedResponse({
      description: "Unauthorized - Authentication is required or has failed.",
      ...unauthorizedErrorSchema,
    }),
    ApiForbiddenResponse({
      description:
        "Forbidden - The authenticated user does not have the necessary permissions.",
      ...forbiddenErrorScheema,
    }),
    ApiNotFoundResponse({
      description:
        "Resource not found - The requested resource does not exist.",
      ...notFoundErrorSchema,
    }),
    ApiInternalServerErrorResponse({
      description:
        "Internal error - An unexpected error occurred on the server side.",
      ...internalServerErrorSchema,
    }),
  );
}
