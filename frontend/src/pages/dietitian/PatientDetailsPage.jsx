import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PatientOverviewPanel from "../../features/dietitian/components/PatientOverviewPanel";
import RemovePatientConfirmationDialog from "../../features/dietitian/components/RemovePatientConfirmationDialog";
import PatientSummaryCard from "../../features/dietitian/components/PatientSummaryCard";
import RecommendationTimelineList from "../../features/dietitian/components/RecommendationTimelineList";
import { usePatientDetailsData } from "../../features/dietitian/hooks/usePatientDetailsData";
import { PATHS } from "../../router/paths";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function PatientDetailsPage() {
  const { t } = useTranslation(["dietitian", "common"]);
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { patientId } = useParams();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const {
    patient,
    overview,
    recommendations,
    isLoading,
    error,
    retryPatients,
    retryRecommendations,
    retryOverview,
    removeRecommendation,
    editRecommendation,
    removePatient,
    isRemovingPatient,
    isMutating,
  } = usePatientDetailsData(patientId);

  const patientsById = useMemo(() => {
    if (!patient?.id) {
      return {};
    }

    return {
      [patient.id]: patient,
    };
  }, [patient]);

  const handleConfirmUnassign = async () => {
    if (!patient?.id) {
      return;
    }

    await removePatient(patient.id);
    notify({
      severity: "success",
      key: "dietitian.patients.notifications.unassigned",
      namespace: "dietitian",
    });
    navigate(PATHS.dietitian.patients);
  };

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

  if (error) {
    return (
      <SectionErrorState
        message={error.message}
        onRetry={() => {
          retryPatients();
          retryRecommendations();
          retryOverview();
        }}
        retryLabel={t("actions.retry")}
      />
    );
  }

  if (isLoading) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

  if (!patient) {
    return (
      <EmptyStateCard
        title={t("patientDetails.notFoundTitle")}
        description={t("patientDetails.notFoundDescription")}
        actionLabel={t("actions.backToPatients")}
        onAction={() => navigate(PATHS.dietitian.patients)}
      />
    );
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
            <Typography variant="h5">{t("patientDetails.title")}</Typography>
            <Typography color="text.secondary">
              {t("patientDetails.description")}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(PATHS.dietitian.patients)}
            >
              {t("actions.backToPatients")}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              disabled={isRemovingPatient}
              onClick={() =>
                navigate(
                  `${PATHS.dietitian.recommendationsCreate}?patientId=${patient.id}`,
                )
              }
            >
              {t("actions.createRecommendation")}
            </Button>
            <Button
              color="error"
              variant="outlined"
              startIcon={<PersonRemoveIcon />}
              onClick={() => setRemoveDialogOpen(true)}
              disabled={isRemovingPatient}
            >
              {t("patients.removeAction")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <PatientSummaryCard patient={patient} />

      <PatientOverviewPanel overview={overview} />

      <Stack spacing={1}>
        <Typography variant="h6">
          {t("patientDetails.timelineTitle")}
        </Typography>
        <RecommendationTimelineList
          recommendations={recommendations}
          patientsById={patientsById}
          isLoading={false}
          error={null}
          onRetry={retryRecommendations}
          onDelete={handleDeleteRecommendation}
          onEdit={handleEditRecommendation}
          isMutating={isMutating}
          emptyTitle={t("patientDetails.emptyRecommendationsTitle")}
          emptyDescription={t("patientDetails.emptyRecommendationsDescription")}
        />
      </Stack>

      <RemovePatientConfirmationDialog
        open={removeDialogOpen}
        patient={patient}
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={handleConfirmUnassign}
        isSubmitting={isRemovingPatient}
      />
    </Stack>
  );
}

export default PatientDetailsPage;
