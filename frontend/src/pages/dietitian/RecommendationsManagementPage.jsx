import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RecommendationTimelineList from "../../features/dietitian/components/RecommendationTimelineList";
import { useDietitianPatients } from "../../features/dietitian/hooks/useDietitianPatients";
import { useDietitianRecommendations } from "../../features/dietitian/hooks/useDietitianRecommendations";
import { PATHS } from "../../router/paths";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function RecommendationsManagementPage() {
  const { t } = useTranslation(["dietitian", "common"]);
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [selectedPatientId, setSelectedPatientId] = useState("");

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
    editRecommendation,
    deleteError,
    updateError,
    isMutating,
  } = useDietitianRecommendations({ patientId: selectedPatientId || null });

  const patientsById = useMemo(() => {
    return patients.reduce((acc, patient) => {
      acc[patient.id] = patient;
      return acc;
    }, {});
  }, [patients]);

  const handleDeleteRecommendation = async (recommendationId) => {
    await removeRecommendation(recommendationId);
    notify({
      severity: "success",
      key: "dietitian.recommendations.notifications.deleted",
      namespace: "dietitian",
    });
  };

  const handleEditRecommendation = async (recommendationId, payload) => {
    await editRecommendation(recommendationId, payload);
    notify({
      severity: "success",
      key: "dietitian.recommendations.notifications.updated",
      namespace: "dietitian",
    });
  };

  if (patientsError) {
    return (
      <SectionErrorState
        message={patientsError.message}
        onRetry={retryPatients}
        retryLabel={t("actions.retry")}
      />
    );
  }

  if (patientsLoading) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

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
            <Typography variant="h5">{t("management.title")}</Typography>
            <Typography color="text.secondary">
              {t("management.description")}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              select
              size="small"
              value={selectedPatientId}
              label={t("management.filterPatient")}
              onChange={(event) => setSelectedPatientId(event.target.value)}
              sx={{ minWidth: 240 }}
            >
              <MenuItem value="">{t("management.allPatients")}</MenuItem>
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate(PATHS.dietitian.recommendationsCreate)}
            >
              {t("actions.createRecommendation")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <RecommendationTimelineList
        recommendations={recommendations}
        patientsById={patientsById}
        isLoading={recommendationsLoading}
        error={recommendationsError}
        onRetry={retryRecommendations}
        onDelete={handleDeleteRecommendation}
        onEdit={handleEditRecommendation}
        isMutating={isMutating}
        mutationError={deleteError || updateError}
        emptyTitle={t("management.emptyTitle")}
        emptyDescription={t("management.emptyDescription")}
      />
    </Stack>
  );
}

export default RecommendationsManagementPage;
