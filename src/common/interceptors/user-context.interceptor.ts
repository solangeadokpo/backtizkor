import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { UserContextService } from "src/core/services/user-contexte.service";

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      return new Observable((observer) => {
        UserContextService.run(request.user.id, request.user, () => {
          next.handle().subscribe({
            next: (value) => observer.next(value),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        });
      });
    }

    return next.handle();
  }
}
