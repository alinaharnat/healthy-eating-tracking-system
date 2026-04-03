import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DashboardCards from "../../features/dashboard/components/DashboardCards";
import { useClientDashboardData } from "../../features/dashboard/hooks/useClientDashboardData";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function ClientDashboardPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const {
    dailySummary,
    periodAnalytics,
    activitySummary,
    recommendations,
    reports,
    lastUpdatedAt,
    isLoading,
    error,
    reload,
    retry,
  } = useClientDashboardData();

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("dashboard:client.title")}</Typography>
            <Typography color="text.secondary">
              {t("dashboard:client.description")}
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => reload({})}
          >
            {t("dashboard:actions.refresh")}
          </Button>
        </Stack>
      </Paper>

      {error ? (
        <SectionErrorState
          message={error.message}
          onRetry={retry}
          retryLabel={t("common:actions.retry")}
        />
      ) : isLoading ? (
        <SectionLoadingState label={t("common:states.loading")} />
      ) : (
        <DashboardCards
          dailySummary={dailySummary}
          periodAnalytics={periodAnalytics}
          activitySummary={activitySummary}
          recommendationsCount={recommendations.length}
          reportsCount={reports.length}
          lastUpdatedAt={lastUpdatedAt}
        />
      )}
    </Stack>
  );
}

export default ClientDashboardPage;
