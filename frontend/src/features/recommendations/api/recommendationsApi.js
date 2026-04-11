import apiClient from "../../../core/api";
import { mapRecommendationList, mapRecommendationModel } from "./mappers";

export async function createRecommendation(payload, options = {}) {
  const response = await apiClient.post("/recommendations", payload, options);
  return mapRecommendationModel(response);
}

export async function listMyRecommendations({ userId } = {}, options = {}) {
  const response = await apiClient.get("/recommendations/my", {
    ...options,
    query: {
      ...(userId ? { userId } : {}),
    },
  });

  return mapRecommendationList(response || []);
}

export async function updateRecommendation(
  recommendationId,
  payload,
  options = {},
) {
  const response = await apiClient.patch(
    `/recommendations/${recommendationId}`,
    payload,
    options,
  );

  return mapRecommendationModel(response);
}

export async function deleteRecommendation(recommendationId, options = {}) {
  const response = await apiClient.delete(
    `/recommendations/${recommendationId}`,
    options,
  );

  return {
    message: response?.message || "Recommendation deleted successfully",
  };
}
