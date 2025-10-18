import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import configuration from "src/config/database/configuration";
import { FileStoreModule } from "./services/filestore/filestore.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    FileStoreModule,
  ],
  exports: [DatabaseModule, FileStoreModule],
})
export class CoreModule {}
