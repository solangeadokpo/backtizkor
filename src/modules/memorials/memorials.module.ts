import { forwardRef, Module } from "@nestjs/common";
import { MemorialsService } from "./services/memorials.service";
import { MemorialsController } from "./memorials.controller";
import { MemorialAccessController } from "./controllers/memorial-access.controller";
import { MemorialsServiceInterface } from "./interfaces/memorial-service.interface";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";
import { JwtProviderModule } from "src/core/services/jwt/jwt.module";
import { Memorial, MemorialSchema } from "./schemas/memorial.schema";
import { ValidationProviderModule } from "src/common/decorators/validators/provider.module";
import { MemorialAccessService } from "./services/memorial-access.service";
import {
  MemorialAccessRequest,
  MemorialAccessRequestSchema,
} from "./schemas/memorial-access-request.schema";
import {
  MemorialWhitelist,
  MemorialWhitelistSchema,
} from "./schemas/memorial-whitelist";
import { WhitelistService } from "./services/whitelist.service";
import { User, UserSchema } from "../users/schemas/user.schema";
import { Role, RoleSchema } from "../roles/schemas/role.schema";
import { RolesModule } from "../roles/roles.module";
import { LikesService } from "./services/likes.service";
import { LikesController } from "./likes.controller";
import { FamilyMembersModule } from "../family-members/family-members.module";
import { FileStoreModule } from "src/core/services/filestore/filestore.module";
import { FamilyMembersService } from "../family-members/services/family-members.service";
import { Like, LikeSchema } from "./schemas/like.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Memorial.name, schema: MemorialSchema },
      { name: MemorialAccessRequest.name, schema: MemorialAccessRequestSchema },
      { name: Like.name, schema: LikeSchema },
      { name: MemorialWhitelist.name, schema: MemorialWhitelistSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    UsersModule,
    RolesModule,
    JwtProviderModule,
    ValidationProviderModule,
    FileStoreModule,
    forwardRef(() => FamilyMembersModule),
  ],
  controllers: [MemorialsController, LikesController, MemorialAccessController],
  providers: [
    MemorialsService,
    MemorialAccessService,
    FamilyMembersService,
    WhitelistService,
    LikesService,
    {
      provide: MemorialsServiceInterface,
      useClass: MemorialsService,
    },
  ],
  exports: [MemorialsServiceInterface, MemorialAccessService, MongooseModule],
})
export class MemorialsModule {}
