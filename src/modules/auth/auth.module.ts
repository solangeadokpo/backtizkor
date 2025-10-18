import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./auth.controller";
import { AuthServiceInterface } from "./services/auth-service.interface";
import { UsersModule } from "../users/users.module";
import { JwtProviderModule } from "src/core/services/jwt/jwt.module";
import { OtpService } from "./services/otp.service";
import { MessagingModule } from "src/core/services/messaging/messaging.module";
import { RedisCacheModule } from "src/core/cache/cache.module";

@Module({
  imports: [UsersModule, JwtProviderModule, MessagingModule, RedisCacheModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthServiceInterface,
      useClass: AuthService,
    },
    OtpService,
  ],
})
export class AuthModule {}
