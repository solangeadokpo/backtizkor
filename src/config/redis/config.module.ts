import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./configuration";
import { RedisConfigService } from "./config.service";

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}
