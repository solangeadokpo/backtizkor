import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get usernname(): string {
    return this.configService.get<string>("database.mongo.username") ?? "";
  }

  get password(): string {
    return this.configService.get<string>("database.mongo.password") ?? "";
  }

  get host(): string {
    return this.configService.get<string>("database.mongo.host") ?? "";
  }

  get port(): number {
    return this.configService.get<number>("database.mongo.port") ?? 27017;
  }

  get database(): string {
    return this.configService.get<string>("database.mongo.database") ?? "";
  }
}
