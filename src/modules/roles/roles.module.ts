import { Module } from "@nestjs/common";
import { RolesService } from "./services/roles.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "./schemas/role.schema";
import { RolesServiceInterface } from "./services/roles-service.interface";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [
    {
      provide: RolesServiceInterface,
      useClass: RolesService,
    },
  ],
  exports: [RolesServiceInterface, MongooseModule],
})
export class RolesModule {}
