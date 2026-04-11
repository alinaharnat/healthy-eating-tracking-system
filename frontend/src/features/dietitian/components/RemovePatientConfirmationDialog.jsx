import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function RemovePatientConfirmationDialog({
  open,
  patient,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation(["dietitian", "common"]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("patients.removeDialogTitle")}</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 0.5 }}>
          <Typography>
            {t("patients.removeDialogDescription", {
              name: patient?.name || t("patients.unknownName"),
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("patients.removeDialogHint")}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common:actions.cancel")}</Button>
        <Button
          color="error"
          onClick={onConfirm}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("actions.saving") : t("patients.removeAction")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemovePatientConfirmationDialog;
