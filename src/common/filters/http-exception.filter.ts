import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { errorResponse } from "../utils/json-response.helper";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res = exception.getResponse();

    const message =
      typeof res === "string"
        ? res
        : (res as any)?.message || "An error occurred";
    const code =
      ((res as any)?.error as string).toUpperCase() ||
      exception.name ||
      "HTTP_EXCEPTION";
    const details = typeof res === "object" ? (res as any)?.message : null;

    response.status(status).json(
      errorResponse(
        {
          code: code,
          details,
        },
        message,
        status,
      ),
    );
  }
}
