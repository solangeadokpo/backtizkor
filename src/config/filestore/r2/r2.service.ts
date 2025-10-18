import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class R2StoreConfigService {
  constructor(private configService: ConfigService) {}

  get accessKeyId(): string {
    return this.configService.get<string>("filestore.r2.accessKeyId", "");
  }

  get secretAccessKey(): string {
    return this.configService.get<string>("filestore.r2.secretAccessKey", "");
  }

  get bucketName(): string {
    return this.configService.get<string>("filestore.r2.bucketName", "");
  }

  get endpoint(): string {
    return this.configService.get<string>("filestore.r2.endpoint", "");
  }

  get publicUrl(): string {
    return this.configService.get<string>("filestore.r2.publicUrl", "");
  }

  get region(): string {
    return this.configService.get<string>("filestore.r2.region", "");
  }
}
