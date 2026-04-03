import apiClient from "../../../core/api";
import {
  mapAdminMessage,
  mapAdminProductActionResult,
  mapAdminUserActionResult,
  mapAdminUserActivity,
  mapAdminUserList,
  mapDatabaseExport,
  mapSystemStatistics,
} from "./mappers";

export async function getAllUsers(options = {}) {
  const response = await apiClient.get("/admin/users", options);
  return mapAdminUserList(response || []);
}

export async function changeUserRole(userId, role, options = {}) {
  const response = await apiClient.patch(
    `/admin/users/${userId}/role`,
    { role },
    options,
  );

  return mapAdminUserActionResult(response);
}

export async function blockUser(userId, options = {}) {
  const response = await apiClient.patch(
    `/admin/users/${userId}/block`,
    {},
    options,
  );
  return mapAdminUserActionResult(response);
}

export async function unblockUser(userId, options = {}) {
  const response = await apiClient.patch(
    `/admin/users/${userId}/unblock`,
    {},
    options,
  );

  return mapAdminUserActionResult(response);
}

export async function getUserFullActivity(userId, options = {}) {
  const response = await apiClient.get(
    `/admin/users/${userId}/activity`,
    options,
  );
  return mapAdminUserActivity(response);
}

export async function updateProductAdmin(productId, payload, options = {}) {
  const response = await apiClient.patch(
    `/admin/products/${productId}`,
    payload,
    options,
  );

  return mapAdminProductActionResult(response);
}

export async function deleteProductAdmin(productId, options = {}) {
  const response = await apiClient.delete(
    `/admin/products/${productId}`,
    options,
  );
  return mapAdminMessage(response);
}

export async function getSystemStatistics(options = {}) {
  const response = await apiClient.get("/admin/statistics", options);
  return mapSystemStatistics(response);
}

export async function exportDatabase(options = {}) {
  const response = await apiClient.get("/admin/export", options);
  return mapDatabaseExport(response);
}

export async function importDatabase(payload, options = {}) {
  const response = await apiClient.post("/admin/import", payload, options);
  return mapAdminMessage(response);
}
