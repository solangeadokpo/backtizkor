import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { IJwtPayload } from "src/core/services/jwt/jwt.interface";
import { JwtService } from "src/core/services/jwt/jwt.service";
import {
  IUsersService,
  UsersServiceInterface,
} from "src/modules/users/services/users-service.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(UsersServiceInterface) private readonly userService: IUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const payload = await this.jwtService.verify<IJwtPayload>(token);
      const user = await this.userService.findOne(payload.sub, [
        { path: "role", select: "name permissions" },
      ]);

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      request["user"] = user;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.header("Authorization");
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.toString().split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
