import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseConfigService } from "src/config/database/config.service";
import { DatabaseConfigModule } from "src/config/database/config.module";

export const DatabaseProvider = MongooseModule.forRootAsync({
  imports: [DatabaseConfigModule],
  useFactory: async (configService: DatabaseConfigService) => {
    const user = configService.usernname;
    const pass = configService.password;
    const host = configService.host;
    const port = configService.port;
    const db = configService.database;
    const uri = `mongodb://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}`;

    return {
      uri,
    };
  },
  inject: [DatabaseConfigService],
});
