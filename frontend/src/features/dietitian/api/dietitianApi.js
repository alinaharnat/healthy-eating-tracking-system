import { listPatients } from "../../users/api";
import {
  createRecommendation,
  deleteRecommendation,
  listMyRecommendations,
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
  const recommendations = await listMyRecommendations(options);

  if (!patientId) {
    return sortByNewest(recommendations);
  }

  return sortByNewest(
    recommendations.filter((item) => String(item.userId) === String(patientId)),
  );
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
