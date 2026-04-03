import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../core/i18n/useLocale";
import { formatLocalizedDateTime } from "../../../shared/lib/format/dateTime";
import EmptyStateCard from "../../../shared/ui/states/EmptyStateCard";
import SectionErrorState from "../../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../../shared/ui/states/SectionLoadingState";

function RecommendationTimelineList({
  recommendations,
  patientsById,
  isLoading,
  error,
  onRetry,
  onDelete,
  isMutating,
  emptyTitle,
  emptyDescription,
}) {
  const { t } = useTranslation(["dietitian", "common"]);
  const { language } = useLocale();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const selectedRecommendation = useMemo(
    () => recommendations.find((item) => item.id === pendingDeleteId) || null,
    [pendingDeleteId, recommendations],
  );

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    await onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  };

  if (error) {
    return (
      <SectionErrorState
        message={error.message}
        onRetry={onRetry}
        retryLabel={t("common:actions.retry")}
      />
    );
  }

  if (isLoading) {
    return <SectionLoadingState label={t("common:states.loading")} />;
  }

  if (!recommendations.length) {
    return (
      <EmptyStateCard
        title={emptyTitle || t("timeline.emptyTitle")}
        description={emptyDescription || t("timeline.emptyDescription")}
      />
    );
  }

  return (
    <>
      <Stack spacing={1.5}>
        {recommendations.map((item) => {
          const patientName =
            patientsById[item.userId]?.name || t("timeline.unknownPatient");

          return (
            <Card key={item.id}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack spacing={0.2}>
                      <Typography variant="subtitle2">{patientName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatLocalizedDateTime(item.createdAt, { language })}
                      </Typography>
                    </Stack>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setPendingDeleteId(item.id)}
                      disabled={isMutating}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Typography variant="body2">{item.message}</Typography>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Dialog
        open={Boolean(selectedRecommendation)}
        onClose={() => setPendingDeleteId(null)}
      >
        <DialogTitle>{t("timeline.deleteDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("timeline.deleteDialogDescription")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteId(null)}>
            {t("common:actions.cancel")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isMutating}
          >
            {t("common:actions.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RecommendationTimelineList;
