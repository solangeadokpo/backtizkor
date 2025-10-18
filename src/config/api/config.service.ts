import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get globalPrefix(): string {
    return this.configService.get<string>("api.globalPrefix", "");
  }

  get rateLimit() {
    return this.configService.get("api.rateLimit");
  }

  get cors() {
    return this.configService.get("api.cors");
  }

  get pagination() {
    return this.configService.get("api.pagination");
  }

  get jwt_secret(): string {
    return this.configService.get<string>("api.jwt.secret", "default_secret");
  }

  get jwt_expires_in(): string {
    return this.configService.get<string>("api.jwt.expiresIn", "1d");
  }
}
