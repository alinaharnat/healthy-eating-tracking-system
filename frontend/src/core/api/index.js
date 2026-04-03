import { getStoredToken } from "../auth/authStorage";
import { createApiClient } from "./apiClient";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = createApiClient({
  baseUrl: API_BASE_URL,
  getAuthToken: () => getStoredToken(),
});

export const setApiUnauthorizedHandler = apiClient.setUnauthorizedHandler;
export default apiClient;
