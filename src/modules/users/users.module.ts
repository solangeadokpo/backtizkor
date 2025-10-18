import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { RolesModule } from "../roles/roles.module";
import { UsersServiceInterface } from "./services/users-service.interface";
import { UserController } from "./user.controller";
import { JwtProviderModule } from "src/core/services/jwt/jwt.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
    JwtProviderModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UsersServiceInterface,
      useClass: UsersService,
    },
  ],
  exports: [UsersServiceInterface, MongooseModule],
})
export class UsersModule {}
