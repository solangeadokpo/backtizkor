import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./configuration";
import { DatabaseConfigService } from "./config.service";

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
