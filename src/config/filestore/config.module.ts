import { Module, Global } from "@nestjs/common";
import { R2StoreConfigModule } from "./r2/r2.module";

@Global()
@Module({
  imports: [R2StoreConfigModule],
  exports: [R2StoreConfigModule],
})
export class FileStoreConfigModule {}
