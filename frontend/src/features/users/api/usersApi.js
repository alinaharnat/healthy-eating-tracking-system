import apiClient from "../../../core/api";
import { mapPatientList, mapUserModel } from "./mappers";

export async function getMe(options = {}) {
  const response = await apiClient.get("/users/me", options);
  return mapUserModel(response);
}

export async function updateMe(payload, options = {}) {
  const response = await apiClient.patch("/users/me", payload, options);
  return mapUserModel(response);
}

export async function listPatients(options = {}) {
  const response = await apiClient.get("/users/patients", options);
  return mapPatientList(response || []);
}
