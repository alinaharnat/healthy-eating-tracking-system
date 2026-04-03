import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import RecommendationTimelineList from "../../features/dietitian/components/RecommendationTimelineList";
import { useDietitianPatients } from "../../features/dietitian/hooks/useDietitianPatients";
import { useDietitianRecommendations } from "../../features/dietitian/hooks/useDietitianRecommendations";
import { PATHS } from "../../router/paths";

function SummaryMetricCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
}

function DietitianDashboardPage() {
  const { t } = useTranslation("dietitian");

  const {
    patients,
    isLoading: patientsLoading,
    error: patientsError,
    retry: retryPatients,
  } = useDietitianPatients();

  const {
    recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
    retry: retryRecommendations,
    removeRecommendation,
    isMutating,
  } = useDietitianRecommendations();

  const patientsById = useMemo(() => {
    return patients.reduce((acc, patient) => {
      acc[patient.id] = patient;
      return acc;
    }, {});
  }, [patients]);

  const assignedPatients = patients.length;
  const patientsWithGoal = patients.filter((item) => item.goalType).length;
  const recentRecommendations = recommendations.slice(0, 5);

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("dashboard.title")}</Typography>
            <Typography color="text.secondary">
              {t("dashboard.description")}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              component={Link}
              to={PATHS.dietitian.recommendationsCreate}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
            >
              {t("actions.createRecommendation")}
            </Button>
            <Button
              component={Link}
              to={PATHS.dietitian.patients}
              variant="outlined"
              startIcon={<GroupsIcon />}
            >
              {t("actions.viewPatients")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryMetricCard
            title={t("dashboard.metrics.assignedPatients")}
            value={assignedPatients}
            icon={<GroupsIcon color="primary" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryMetricCard
            title={t("dashboard.metrics.activeGoals")}
            value={patientsWithGoal}
            icon={<HistoryIcon color="secondary" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryMetricCard
            title={t("dashboard.metrics.recommendations")}
            value={recommendations.length}
            icon={<AddCircleOutlineIcon color="success" />}
          />
        </Grid>
      </Grid>

      <Stack spacing={1}>
        <Typography variant="h6">{t("dashboard.recentTitle")}</Typography>
        <RecommendationTimelineList
          recommendations={recentRecommendations}
          patientsById={patientsById}
          isLoading={patientsLoading || recommendationsLoading}
          error={patientsError || recommendationsError}
          onRetry={() => {
            retryPatients();
            retryRecommendations();
          }}
          onDelete={removeRecommendation}
          isMutating={isMutating}
          emptyTitle={t("dashboard.emptyRecommendationsTitle")}
          emptyDescription={t("dashboard.emptyRecommendationsDescription")}
        />
      </Stack>
    </Stack>
  );
}

export default DietitianDashboardPage;
