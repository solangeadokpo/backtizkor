import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { IJwtPayload } from "./jwt.interface";
import { ApiConfigService } from "src/config/api/config.service";

@Injectable()
export class JwtService {
  constructor(
    private readonly jwt: NestJwtService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async sign(payload: IJwtPayload, expiresIn: string = "1d"): Promise<string> {
    return this.jwt.signAsync(payload, { expiresIn });
  }

  async verify<T extends object = IJwtPayload>(token: string): Promise<T> {
    try {
      return await this.jwt.verifyAsync<T>(token, {
        secret: this.apiConfigService.jwt_secret,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("The provided token has expired.");
      }

      throw new UnauthorizedException(
        "The provided token is invalid or malformed.",
      );
    }
  }

  decode(token: string): IJwtPayload | null {
    return this.jwt.decode(token) as IJwtPayload | null;
  }
}
