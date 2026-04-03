import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import RecommendationsPanel from "../../features/recommendations/components/RecommendationsPanel";
import { useRecommendations } from "../../features/recommendations/hooks/useRecommendations";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function RecommendationsPage() {
  const { t } = useTranslation(["recommendations", "common"]);

  const {
    recommendations,
    isLoading,
    error,
    retry,
    generate,
    remove,
    isMutating,
  } = useRecommendations();

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("recommendations:title")}</Typography>
            <Typography color="text.secondary">
              {t("recommendations:description")}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={generate}
            disabled={isMutating}
          >
            {t("recommendations:generateAction")}
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
        <RecommendationsPanel
          recommendations={recommendations}
          onDelete={remove}
          onGenerate={generate}
          isMutating={isMutating}
        />
      )}
    </Stack>
  );
}

export default RecommendationsPage;
