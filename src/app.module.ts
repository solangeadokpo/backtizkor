import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CoreModule } from "./core/core.module";
import { ApiConfigModule } from "./config/api/config.module";
import { DatabaseConfigModule } from "./config/database/config.module";
import { BaseModule } from "./modules/base.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ValidationProviderModule } from "./common/decorators/validators/provider.module";
import { FileStoreConfigModule } from "./config/filestore/config.module";

@Module({
  imports: [
    ApiConfigModule,
    DatabaseConfigModule,
    FileStoreConfigModule,
    CoreModule,
    BaseModule,
    ValidationProviderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
