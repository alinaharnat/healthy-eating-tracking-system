import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PatientSummaryCard from "../../features/dietitian/components/PatientSummaryCard";
import RecommendationTimelineList from "../../features/dietitian/components/RecommendationTimelineList";
import { usePatientDetailsData } from "../../features/dietitian/hooks/usePatientDetailsData";
import { PATHS } from "../../router/paths";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function PatientDetailsPage() {
  const { t } = useTranslation(["dietitian", "common"]);
  const navigate = useNavigate();
  const { patientId } = useParams();

  const {
    patient,
    recommendations,
    isLoading,
    error,
    retryPatients,
    retryRecommendations,
    removeRecommendation,
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

  if (error) {
    return (
      <SectionErrorState
        message={error.message}
        onRetry={() => {
          retryPatients();
          retryRecommendations();
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
              onClick={() =>
                navigate(
                  `${PATHS.dietitian.recommendationsCreate}?patientId=${patient.id}`,
                )
              }
            >
              {t("actions.createRecommendation")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <PatientSummaryCard patient={patient} />

      <Paper sx={{ p: 3 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6">
            {t("patientDetails.readOnlyTitle")}
          </Typography>
          <Typography color="text.secondary">
            {t("patientDetails.readOnlyDescription")}
          </Typography>
        </Stack>
      </Paper>

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
          onDelete={removeRecommendation}
          isMutating={isMutating}
          emptyTitle={t("patientDetails.emptyRecommendationsTitle")}
          emptyDescription={t("patientDetails.emptyRecommendationsDescription")}
        />
      </Stack>
    </Stack>
  );
}

export default PatientDetailsPage;
