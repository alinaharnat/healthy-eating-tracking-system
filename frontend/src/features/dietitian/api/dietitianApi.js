import { getNutritionAndActivityOverview } from "../../analytics/api";
import {
  listIncomingDietitianRequests,
  listPatients,
  respondDietitianRequest,
  unassignPatient,
} from "../../users/api";
import {
  createRecommendation,
  deleteRecommendation,
  listMyRecommendations,
  updateRecommendation,
} from "../../recommendations/api";

function sortByNewest(items = []) {
  return [...items].sort((left, right) => {
    const leftTs = new Date(left.createdAt || 0).getTime();
    const rightTs = new Date(right.createdAt || 0).getTime();
    return rightTs - leftTs;
  });
}

export async function listAssignedPatients(options = {}) {
  return listPatients(options);
}

// Assumption: /recommendations/my returns recommendations created by the current user.
// For a dietitian account, this is used as recommendation history and filtered by userId.
export async function listDietitianRecommendations(
  { patientId } = {},
  options = {},
) {
  const recommendations = await listMyRecommendations(
    {
      userId: patientId || undefined,
    },
    options,
  );

  return sortByNewest(recommendations);
}

export async function createRecommendationForPatient(payload, options = {}) {
  const userId = payload?.userId;
  const message = payload?.message?.trim();

  if (!userId || !message) {
    throw new Error("Recommendation requires userId and message");
  }

  return createRecommendation(
    {
      userId,
      message,
    },
    options,
  );
}

export async function deleteDietitianRecommendation(
  recommendationId,
  options = {},
) {
  return deleteRecommendation(recommendationId, options);
}

export async function updateDietitianRecommendation(
  recommendationId,
  payload,
  options = {},
) {
  const message = payload?.message?.trim();

  if (!message) {
    throw new Error("Recommendation message is required");
  }

  return updateRecommendation(
    recommendationId,
    {
      message,
    },
    options,
  );
}

export async function getDietitianPatientOverview(patientId, options = {}) {
  return getNutritionAndActivityOverview(
    {
      userId: patientId,
      activityPeriod: "week",
    },
    options,
  );
}

export async function unassignDietitianPatient(patientId, options = {}) {
  return unassignPatient(patientId, options);
}

export async function listPatientAssignmentRequests(options = {}) {
  return listIncomingDietitianRequests({}, options);
}

export async function respondPatientAssignmentRequest(
  requestId,
  payload,
  options = {},
) {
  return respondDietitianRequest(requestId, payload, options);
}
