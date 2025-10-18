import { Module } from "@nestjs/common";
import { R2Service } from "./r2.service";
import { R2StoreConfigModule } from "src/config/filestore/r2/r2.module";

@Module({
  imports: [R2StoreConfigModule],
  providers: [R2Service],
  exports: [R2Service],
})
export class R2Module {}
