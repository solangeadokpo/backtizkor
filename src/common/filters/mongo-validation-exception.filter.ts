import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { MongoServerError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { Response } from "express";
import { errorResponse } from "../utils/json-response.helper";

@Catch(MongoServerError, MongooseError.ValidationError)
export class MongoValidationExceptionFilter implements ExceptionFilter {
  catch(
    exception: MongoServerError | MongooseError.ValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let details: { field: string; message: string }[] = [];

    if ("code" in exception && exception.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(exception.keyPattern)[0];
      const value = exception.keyValue?.[field];
      details.push({
        field: field,
        message: `${field} "${value}" already exists`,
      });
    } else if (exception instanceof MongooseError.ValidationError) {
      // Mongoose validation error
      for (const [field, error] of Object.entries(exception.errors)) {
        details.push({ field: field, message: (error as any).message });
      }
    } else {
      // Unexpected MongoDB error
      return response
        .status(500)
        .json(
          errorResponse(exception.message, "Unexpected database error", 500),
        );
    }

    return response.status(422).json(
      errorResponse(
        {
          code: "UNPROCESSABLE_ENTITY",
          details,
        },
        "Validation failed",
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
    );
  }
}
