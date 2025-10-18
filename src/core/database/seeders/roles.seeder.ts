import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RolePermissionsMap } from "src/common/constants/role-permissions.map.constant";
import { AppRole } from "src/common/constants/roles.constant";
import { RoleDocument } from "src/modules/roles/schemas/role.schema";

@Injectable()
export class RolesSeeder {
  constructor(
    @InjectModel("Role") private readonly roleModel: Model<RoleDocument>,
  ) {}

  async seed() {
    for (const roleName of Object.values(AppRole)) {
      const permissions = RolePermissionsMap[roleName];

      const existing = await this.roleModel.findOne({ name: roleName });
      if (existing) {
        existing.permissions = permissions;
        await existing.save();
        Logger.log(`Updated role: ${roleName}`);
      } else {
        await this.roleModel.create({ name: roleName, permissions });
        Logger.log(`Created role: ${roleName}`);
      }
    }

    Logger.log("Roles seeding completed.");
  }
}
