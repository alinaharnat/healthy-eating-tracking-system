import apiClient from "../../../core/api";
import {
  mapActivitySummaryModel,
  mapAutoRecommendationsModel,
  mapDailySummaryModel,
  mapPeriodAnalyticsModel,
} from "./mappers";

export async function getDailyNutritionSummary({ date } = {}, options = {}) {
  const response = await apiClient.get("/analytics/daily", {
    ...options,
    query: {
      date,
    },
  });

  return mapDailySummaryModel(response);
}

export async function getPeriodAnalytics(
  { period = "week" } = {},
  options = {},
) {
  const response = await apiClient.get("/analytics/period", {
    ...options,
    query: {
      period,
    },
  });

  return mapPeriodAnalyticsModel(response);
}

export async function getActivitySummary(
  { period = "day" } = {},
  options = {},
) {
  const response = await apiClient.get("/analytics/activity", {
    ...options,
    query: {
      period,
    },
  });

  return mapActivitySummaryModel(response);
}

export async function generateAutoRecommendations(options = {}) {
  const response = await apiClient.post(
    "/analytics/recommendations/auto",
    {},
    options,
  );

  return mapAutoRecommendationsModel(response);
}
