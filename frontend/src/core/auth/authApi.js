import apiClient from "../api";
import { ApiClientError } from "../api/errorNormalizer";
import {
  getCurrentUser,
  login,
  register,
} from "../../features/auth/api/authApi";

export const ApiError = ApiClientError;

export function apiRequest(path, { method = "GET", ...options } = {}) {
  return apiClient.request(path, {
    ...options,
    method,
  });
}

export function loginRequest(credentials, options = {}) {
  return login(credentials, options);
}

export function registerRequest(payload, options = {}) {
  return register(payload, options);
}

export function fetchCurrentUser(tokenOrOptions) {
  if (typeof tokenOrOptions === "string") {
    return getCurrentUser({ token: tokenOrOptions });
  }

  return getCurrentUser(tokenOrOptions || {});
}
