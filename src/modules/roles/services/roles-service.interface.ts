import { RoleDocument } from "../schemas/role.schema";

export interface IRolesService {
  /**
   * Finds all roles.
   * @returns A promise that resolves to an array of roles.
   */
  findAll(): Promise<RoleDocument[]>;

  /**
   * Finds a role by its name.
   * @param name - The name of the role to find.
   * @returns A promise that resolves to the found role or null if not found.
   */
  findByName(name: string): Promise<RoleDocument | null>;

  /**
   * Has the given permission for the specified role.
   * @param roleName - The name of the role to check.
   * @param permission - The permission to check for.
   * @returns A promise that resolves to true if the role has the permission, false otherwise.
   */
  hasPermission(roleName: string, permission: string): Promise<boolean>;

  /**
   * Gets all permissions for the specified role.
   * @param roleName - The name of the role to get permissions for.
   * @returns A promise that resolves to an array of permissions for the role.
   */
  getPermissions(roleName: string): Promise<string[]>;
}

export const RolesServiceInterface = Symbol("RolesServiceInterface");
