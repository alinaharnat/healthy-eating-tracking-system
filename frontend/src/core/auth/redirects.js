import { ROLES } from "./constants";

export function getDefaultRouteForRole(role) {
  switch (role) {
    case ROLES.CLIENT:
      return "/client";
    case ROLES.DIETITIAN:
      return "/dietitian";
    case ROLES.ADMIN:
      return "/admin";
    default:
      return "/login";
  }
}

export function canRoleAccessPath(role, path) {
  if (!role || !path) {
    return false;
  }

  if (role === ROLES.CLIENT) {
    return path.startsWith("/client");
  }

  if (role === ROLES.DIETITIAN) {
    return path.startsWith("/dietitian");
  }

  if (role === ROLES.ADMIN) {
    return path.startsWith("/admin");
  }

  return false;
}

export function resolvePostLoginPath({ role, fromPath }) {
  if (fromPath && canRoleAccessPath(role, fromPath)) {
    return fromPath;
  }

  return getDefaultRouteForRole(role);
}
