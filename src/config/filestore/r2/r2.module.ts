import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "../configuration";
import { R2StoreConfigService } from "./r2.service";

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  providers: [R2StoreConfigService],
  exports: [R2StoreConfigService],
})
export class R2StoreConfigModule {}
