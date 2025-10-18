import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtService } from "./jwt.service";
import { ApiConfigModule } from "src/config/api/config.module";
import { ApiConfigService } from "src/config/api/config.service";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ApiConfigModule],
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.jwt_secret,
        signOptions: {
          expiresIn: configService.jwt_expires_in,
        },
      }),
      inject: [ApiConfigService],
    }),
    ApiConfigModule,
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtProviderModule {}
