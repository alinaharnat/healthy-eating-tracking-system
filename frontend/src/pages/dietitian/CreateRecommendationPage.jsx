import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecommendationForm from "../../features/dietitian/components/RecommendationForm";
import { useCreateRecommendation } from "../../features/dietitian/hooks/useCreateRecommendation";
import { useDietitianPatients } from "../../features/dietitian/hooks/useDietitianPatients";
import { PATHS } from "../../router/paths";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import EmptyStateCard from "../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function CreateRecommendationPage() {
  const { t } = useTranslation(["dietitian", "common"]);
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get("patientId") || "";

  const {
    patients,
    isLoading: patientsLoading,
    error: patientsError,
    retry: retryPatients,
  } = useDietitianPatients();

  const { createRecommendation, isSubmitting, error } =
    useCreateRecommendation();

  const handleSubmit = async (payload) => {
    await createRecommendation(payload);
    notify({
      severity: "success",
      key: "dietitian.recommendations.notifications.created",
      namespace: "dietitian",
    });
    navigate(PATHS.dietitian.recommendationsManagement);
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

  if (!patients.length) {
    return (
      <EmptyStateCard
        title={t("create.emptyPatientsTitle")}
        description={t("create.emptyPatientsDescription")}
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
            <Typography variant="h5">{t("create.title")}</Typography>
            <Typography color="text.secondary">
              {t("create.description")}
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(PATHS.dietitian.recommendationsManagement)}
          >
            {t("actions.backToHistory")}
          </Button>
        </Stack>
      </Paper>

      <RecommendationForm
        key={initialPatientId || "none"}
        patients={patients}
        initialPatientId={initialPatientId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        onCancel={() => navigate(PATHS.dietitian.recommendationsManagement)}
      />
    </Stack>
  );
}

export default CreateRecommendationPage;
