import { forwardRef, Module } from "@nestjs/common";
import { FamilyMembersService } from "./services/family-members.service";
import { FamilyMembersController } from "./family-members.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  FamilyMember,
  FamilyMemberSchema,
} from "./schemas/family-member.schema";
import { UsersModule } from "../users/users.module";
import { MemorialsModule } from "../memorials/memorials.module";
import { JwtProviderModule } from "src/core/services/jwt/jwt.module";
import { FamilyMemberServiceInterface } from "./services/family-member-service.interface";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FamilyMember.name, schema: FamilyMemberSchema },
    ]),
    forwardRef(() => MemorialsModule),
    UsersModule,
    JwtProviderModule,
  ],
  controllers: [FamilyMembersController],
  providers: [
    {
      provide: FamilyMemberServiceInterface,
      useClass: FamilyMembersService,
    },
  ],
  exports: [MongooseModule, FamilyMemberServiceInterface],
})
export class FamilyMembersModule {}
