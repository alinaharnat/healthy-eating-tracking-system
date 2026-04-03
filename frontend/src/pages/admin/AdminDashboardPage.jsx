import AssessmentIcon from "@mui/icons-material/Assessment";
import BackupIcon from "@mui/icons-material/Backup";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import StatisticsCards from "../../features/admin/components/StatisticsCards";
import { useAdminSystemStatistics } from "../../features/admin/hooks/useAdminSystemStatistics";
import { PATHS } from "../../router/paths";
import PageHeaderCard from "../../shared/ui/PageHeaderCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function AdminDashboardPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { stats, isLoading, error, retry } = useAdminSystemStatistics();

  return (
    <Stack spacing={2.5}>
      <PageHeaderCard
        title={t("overview.title")}
        description={t("overview.description")}
      />

      {error ? (
        <SectionErrorState
          message={error.message}
          onRetry={retry}
          retryLabel={t("common:actions.retry")}
        />
      ) : isLoading ? (
        <SectionLoadingState label={t("common:states.loading")} />
      ) : (
        <StatisticsCards stats={stats} />
      )}

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">{t("overview.quickActions")}</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              component={Link}
              to={PATHS.admin.users}
              startIcon={<PeopleIcon />}
              variant="contained"
            >
              {t("navigation.users")}
            </Button>
            <Button
              component={Link}
              to={PATHS.admin.products}
              startIcon={<Inventory2Icon />}
              variant="contained"
            >
              {t("navigation.products")}
            </Button>
            <Button
              component={Link}
              to={PATHS.admin.statistics}
              startIcon={<AssessmentIcon />}
              variant="contained"
            >
              {t("navigation.statistics")}
            </Button>
            <Button
              component={Link}
              to={PATHS.admin.backup}
              startIcon={<BackupIcon />}
              variant="contained"
            >
              {t("navigation.backup")}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default AdminDashboardPage;
