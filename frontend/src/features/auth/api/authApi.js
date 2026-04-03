import apiClient from "../../../core/api";
import { mapUserModel } from "../../users/api/mappers";
import { mapAuthSessionModel } from "./mappers";

export async function login(credentials, options = {}) {
  const response = await apiClient.post("/auth/login", credentials, {
    ...options,
    auth: false,
  });

  return mapAuthSessionModel(response);
}

export async function register(payload, options = {}) {
  const response = await apiClient.post("/auth/register", payload, {
    ...options,
    auth: false,
  });

  return mapAuthSessionModel(response);
}

export async function getCurrentUser(options = {}) {
  const response = await apiClient.get("/auth/me", options);
  return mapUserModel(response);
}
