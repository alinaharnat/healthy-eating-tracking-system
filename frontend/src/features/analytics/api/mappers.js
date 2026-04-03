import { mapRecommendationList } from "../../recommendations/api/mappers";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function mapDailySummaryModel(dto = {}) {
  return {
    date: dto.date || null,
    goal: toNumber(dto.goal),
    status: dto.status || "unknown",
    totals: {
      calories: toNumber(dto?.totals?.calories),
      proteins: toNumber(dto?.totals?.proteins),
      fats: toNumber(dto?.totals?.fats),
      carbs: toNumber(dto?.totals?.carbs),
    },
  };
}

export function mapPeriodAnalyticsModel(dto = {}) {
  return {
    period: dto.period || "week",
    averageCalories: toNumber(dto.averageCalories),
    minCalories: toNumber(dto.minCalories),
    maxCalories: toNumber(dto.maxCalories),
    criticalDay: dto.criticalDay || null,
    days: Array.isArray(dto.days) ? dto.days : [],
  };
}

export function mapActivitySummaryModel(dto = {}) {
  return {
    period: dto.period || "day",
    totalSteps: toNumber(dto.totalSteps),
    burnedCalories: toNumber(dto.burnedCalories),
    lastWeight: dto.lastWeight === null ? null : toNumber(dto.lastWeight),
  };
}

export function mapAutoRecommendationsModel(dto = {}) {
  return {
    generated: toNumber(dto.generated),
    recommendations: mapRecommendationList(dto.recommendations || []),
  };
}
