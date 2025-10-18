import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IRolesService } from "./roles-service.interface";
import { Role, RoleDocument } from "../schemas/role.schema";

@Injectable()
export class RolesService implements IRolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  /**
   * Finds all roles.
   * @returns A promise that resolves to an array of roles.
   */
  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find().exec();
  }

  /**
   * Finds a role by its name.
   * @param name - The name of the role to find.
   * @returns A promise that resolves to the found role or null if not found.
   */
  async findById(id: string): Promise<RoleDocument | null> {
    return this.roleModel.findById(id).exec();
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  /**
   * Gets all permissions for the specified role.
   * @param roleName - The name of the role to get permissions for.
   * @returns A promise that resolves to an array of permissions for the role.
   */
  async getPermissions(roleName: string): Promise<string[]> {
    const role = await this.findByName(roleName);
    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }
    return role.permissions;
  }

  /**
   * Has the given permission for the specified role.
   * @param roleName - The name of the role to check.
   * @param permission - The permission to check for.
   * @returns A promise that resolves to true if the role has the permission, false otherwise.
   */
  async hasPermission(roleName: string, permission: string): Promise<boolean> {
    const permissions = await this.getPermissions(roleName);
    return permissions.includes(permission);
  }
}
