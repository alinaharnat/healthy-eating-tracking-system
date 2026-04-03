import { Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ReportsList from "../../features/reports/components/ReportsList";
import { useReports } from "../../features/reports/hooks/useReports";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function ReportsPage() {
  const { t } = useTranslation(["reports", "common"]);

  const {
    reports,
    isLoading,
    error,
    retry,
    addReport,
    removeReport,
    isMutating,
  } = useReports();

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={0.5}>
          <Typography variant="h5">{t("reports:title")}</Typography>
          <Typography color="text.secondary">
            {t("reports:description")}
          </Typography>
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
        <ReportsList
          reports={reports}
          onCreate={addReport}
          onDelete={removeReport}
          isMutating={isMutating}
        />
      )}
    </Stack>
  );
}

export default ReportsPage;
