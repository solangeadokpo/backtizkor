import { Module, Global } from "@nestjs/common";
import { R2Module } from "./r2/r2.module";
import { R2Service } from "./r2/r2.service";
import { FileStoreServiceInterface } from "./filestore-service.interface";

@Global()
@Module({
  imports: [R2Module],
  providers: [
    {
      provide: FileStoreServiceInterface,
      useClass: R2Service,
    },
  ],
  exports: [FileStoreServiceInterface],
})
export class FileStoreModule {}
