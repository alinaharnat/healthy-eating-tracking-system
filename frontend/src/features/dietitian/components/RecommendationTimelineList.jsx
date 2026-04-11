import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
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
  onEdit,
  isMutating,
  mutationError,
  emptyTitle,
  emptyDescription,
}) {
  const { t } = useTranslation(["dietitian", "common"]);
  const { language } = useLocale();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [editingRecommendationId, setEditingRecommendationId] = useState(null);
  const [editingMessage, setEditingMessage] = useState("");

  const selectedRecommendation = useMemo(
    () => recommendations.find((item) => item.id === pendingDeleteId) || null,
    [pendingDeleteId, recommendations],
  );

  const editingRecommendation = useMemo(
    () =>
      recommendations.find((item) => item.id === editingRecommendationId) ||
      null,
    [editingRecommendationId, recommendations],
  );

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    await onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const handleOpenEdit = (item) => {
    if (!onEdit) {
      return;
    }

    setEditingRecommendationId(item.id);
    setEditingMessage(item.message || "");
  };

  const handleConfirmEdit = async () => {
    if (!onEdit || !editingRecommendationId) {
      return;
    }

    const nextMessage = editingMessage.trim();

    if (!nextMessage) {
      return;
    }

    await onEdit(editingRecommendationId, { message: nextMessage });
    setEditingRecommendationId(null);
    setEditingMessage("");
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
      {mutationError ? (
        <Alert severity="error">{mutationError.message}</Alert>
      ) : null}

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
                      color="primary"
                      onClick={() => handleOpenEdit(item)}
                      disabled={isMutating || !onEdit}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
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

      <Dialog
        open={Boolean(editingRecommendation)}
        onClose={() => setEditingRecommendationId(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("timeline.editDialogTitle")}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t("timeline.editDialogDescription")}
            </Typography>
            <TextField
              multiline
              minRows={4}
              value={editingMessage}
              onChange={(event) => setEditingMessage(event.target.value)}
              fullWidth
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingRecommendationId(null)}>
            {t("common:actions.cancel")}
          </Button>
          <Button
            onClick={handleConfirmEdit}
            variant="contained"
            disabled={isMutating || !editingMessage.trim()}
          >
            {t("dietitian:actions.update")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RecommendationTimelineList;
