import { AppPermission } from "./permissions.constant";
import { AppRole } from "./roles.constant";

export const RolePermissionsMap: Record<AppRole, AppPermission[]> = {
  [AppRole.VISITOR]: [],
  [AppRole.RELATIVE]: [AppPermission.VIEW_MEMORIAL],
  [AppRole.CLIENT]: [
    AppPermission.VIEW_MEMORIAL,
    AppPermission.CREATE_MEMORIAL,
    AppPermission.UPDATE_MEMORIAL,
  ],
  [AppRole.ADMIN]: [
    AppPermission.VIEW_MEMORIAL,
    AppPermission.CREATE_MEMORIAL,
    AppPermission.UPDATE_MEMORIAL,
    AppPermission.DELETE_MEMORIAL,
    AppPermission.MANAGE_MEMORIAL_ACCESS,
    AppPermission.MANAGE_USERS,
    AppPermission.VIEW_USERS,
  ],
  [AppRole.SUPERADMIN]: Object.values(AppPermission),
};
