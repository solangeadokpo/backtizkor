import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const timestamp = new Date().toISOString();
    const exceptionResponse = exception.getResponse() as
      | { message: any; error: string }
      | string;

    let message = "Validation failed";
    let details: any[] = [];

    if (
      typeof exceptionResponse === "object" &&
      Array.isArray(exceptionResponse["message"])
    ) {
      details = exceptionResponse["message"].map((msg: string) => {
        const [field, ...rest] = msg.split(" ");
        return {
          field,
          message: msg,
        };
      });
    }

    return response.status(status).json({
      status_code: status,
      timestamp,
      message,
      error: {
        code: "UNPROCESSABLE_ENTITY",
        details,
      },
    });
  }
}
