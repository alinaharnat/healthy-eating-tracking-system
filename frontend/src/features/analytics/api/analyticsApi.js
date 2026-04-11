import apiClient from "../../../core/api";
import {
  mapActivitySummaryModel,
  mapAutoRecommendationsModel,
  mapDailySummaryModel,
  mapNutritionAndActivityOverviewModel,
  mapPeriodAnalyticsModel,
} from "./mappers";

export async function getDailyNutritionSummary(
  { date, userId } = {},
  options = {},
) {
  const response = await apiClient.get("/analytics/daily", {
    ...options,
    query: {
      date,
      userId,
    },
  });

  return mapDailySummaryModel(response);
}

export async function getPeriodAnalytics(
  { period = "week", userId } = {},
  options = {},
) {
  const response = await apiClient.get("/analytics/period", {
    ...options,
    query: {
      period,
      userId,
    },
  });

  return mapPeriodAnalyticsModel(response);
}

export async function getActivitySummary(
  { period = "day", userId } = {},
  options = {},
) {
  const response = await apiClient.get("/analytics/activity", {
    ...options,
    query: {
      period,
      userId,
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

export async function getNutritionAndActivityOverview(
  { userId, date, activityPeriod = "week" } = {},
  options = {},
) {
  const response = await apiClient.get("/analytics/overview", {
    ...options,
    query: {
      userId,
      date,
      activityPeriod,
    },
  });

  return mapNutritionAndActivityOverviewModel(response);
}
