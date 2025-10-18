/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Types } from "mongoose";

@Injectable()
export class MongoSerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (data === null || data === undefined) {
          return data;
        }
        return this.transformData(data);
      }),
    );
  }

  private transformData(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    if (data !== null && typeof data === "object") {
      const dataObj = data as Record<string, unknown>;
      if (dataObj.toObject && typeof dataObj.toObject === "function") {
        const toObjectFn = dataObj.toObject as () => Record<string, unknown>;
        const transformedData = toObjectFn();
        return this.transformData(transformedData);
      }

      const result: Record<string, unknown> = {};
      for (const key in dataObj) {
        if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
          const value = dataObj[key];

          if (value instanceof Types.ObjectId) {
            result[key] = value.toString();
          } else if (
            value &&
            typeof value === "object" &&
            (value as any).buffer &&
            (value as any).buffer.type === "Buffer" &&
            (value as any).buffer.data
          ) {
            try {
              const objectId = new Types.ObjectId(
                Buffer.from((value as any).buffer.data),
              );
              result[key] = objectId.toString();
            } catch (error) {
              result[key] = value;
            }
          } else if (value !== null && typeof value === "object") {
            result[key] = this.transformData(value);
          } else {
            result[key] = value;
          }
        }
      }
      return result;
    }

    return data;
  }
}
