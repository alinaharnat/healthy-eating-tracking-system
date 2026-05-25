import apiClient from "../../../core/api";
import {
  mapDietitianAssignmentRequestList,
  mapDietitianAssignmentRequestModel,
  mapPatientList,
  mapUserList,
  mapUserModel,
} from "./mappers";

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

export async function unassignPatient(patientId, options = {}) {
  const response = await apiClient.delete(
    `/users/patients/${patientId}/assignment`,
    options,
  );

  return {
    message: response?.message || "Patient was unassigned successfully",
    patientId: response?.patientId || patientId,
  };
}

export async function listDietitians(options = {}) {
  const response = await apiClient.get("/users/dietitians", options);
  return mapUserList(response || []);
}

export async function createDietitianRequest(payload, options = {}) {
  const response = await apiClient.post(
    "/users/dietitian-requests",
    payload,
    options,
  );

  return mapDietitianAssignmentRequestModel(response);
}

export async function listOutgoingDietitianRequests(options = {}) {
  const response = await apiClient.get(
    "/users/dietitian-requests/outgoing",
    options,
  );

  return mapDietitianAssignmentRequestList(response || []);
}

export async function listIncomingDietitianRequests(
  { status } = {},
  options = {},
) {
  const response = await apiClient.get("/users/dietitian-requests/incoming", {
    ...options,
    query: {
      ...(status ? { status } : {}),
    },
  });

  return mapDietitianAssignmentRequestList(response || []);
}

export async function respondDietitianRequest(
  requestId,
  payload,
  options = {},
) {
  const response = await apiClient.patch(
    `/users/dietitian-requests/${requestId}/respond`,
    payload,
    options,
  );

  return mapDietitianAssignmentRequestModel(response);
}

export async function cancelDietitianRequest(requestId, options = {}) {
  const response = await apiClient.patch(
    `/users/dietitian-requests/${requestId}/cancel`,
    {},
    options,
  );

  return mapDietitianAssignmentRequestModel(response);
}
