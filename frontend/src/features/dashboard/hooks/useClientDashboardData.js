import { useMemo } from "react";
import {
  getActivitySummary,
  getDailyNutritionSummary,
  getPeriodAnalytics,
} from "../../analytics/api";
import { listMyRecommendations } from "../../recommendations/api";
import { getMyReports } from "../../reports/api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function useClientDashboardData() {
  const dashboardRequest = useApiRequest(
    async ({ signal }) => {
      const [
        dailySummary,
        periodAnalytics,
        activitySummary,
        recommendations,
        reports,
      ] = await Promise.all([
        getDailyNutritionSummary({ date: getTodayIsoDate() }, { signal }),
        getPeriodAnalytics({ period: "week" }, { signal }),
        getActivitySummary({ period: "week" }, { signal }),
        listMyRecommendations({ signal }),
        getMyReports({ signal }),
      ]);

      return {
        dailySummary,
        periodAnalytics,
        activitySummary,
        recommendations,
        reports,
        lastUpdatedAt: new Date().toISOString(),
      };
    },
    {
      manual: false,
      retries: 1,
      retryDelayMs: 300,
    },
  );

  const data = useMemo(
    () =>
      dashboardRequest.data || {
        dailySummary: null,
        periodAnalytics: null,
        activitySummary: null,
        recommendations: [],
        reports: [],
        lastUpdatedAt: null,
      },
    [dashboardRequest.data],
  );

  return {
    ...data,
    isLoading: dashboardRequest.isLoading,
    error: dashboardRequest.error,
    reload: dashboardRequest.run,
    retry: dashboardRequest.retry,
    cancel: dashboardRequest.cancel,
  };
}
