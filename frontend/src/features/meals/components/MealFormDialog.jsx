import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
import MealEntryForm from "./MealEntryForm";

function MealFormDialog({
  open,
  initialMeal,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
}) {
  const { t } = useTranslation("meals");

  const isEditMode = Boolean(initialMeal?.id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditMode ? t("form.editTitle") : t("form.createTitle")}
      </DialogTitle>
      <DialogContent>
        <MealEntryForm
          key={initialMeal?.id || "new"}
          initialMeal={initialMeal}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}

export default MealFormDialog;
