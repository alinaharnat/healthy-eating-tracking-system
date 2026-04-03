import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedApiErrorMessage } from "../../../shared/lib/errors/getLocalizedApiErrorMessage";

function mapProductToForm(product) {
  return {
    name: product?.name || "",
    calories: product?.calories ?? "",
    proteins: product?.proteins ?? "",
    fats: product?.fats ?? "",
    carbs: product?.carbs ?? "",
  };
}

function ProductEditDialog({
  open,
  product,
  mode = "edit",
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
}) {
  const { t } = useTranslation(["admin", "notifications"]);
  const [form, setForm] = useState(() => mapProductToForm(product));
  const [validationError, setValidationError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidationError("");

    const name = form.name.trim();
    const calories = Number(form.calories);
    const proteins = Number(form.proteins);
    const fats = Number(form.fats);
    const carbs = Number(form.carbs);

    if (!name) {
      setValidationError(t("products.validation.nameRequired"));
      return;
    }

    if (
      Number.isNaN(calories) ||
      Number.isNaN(proteins) ||
      Number.isNaN(fats) ||
      Number.isNaN(carbs)
    ) {
      setValidationError(t("products.validation.invalidNumeric"));
      return;
    }

    if (calories <= 0) {
      setValidationError(t("products.validation.caloriesPositive"));
      return;
    }

    if (proteins < 0 || fats < 0 || carbs < 0) {
      setValidationError(t("products.validation.macrosNonNegative"));
      return;
    }

    await onSubmit({
      name,
      calories,
      proteins,
      fats,
      carbs,
    });
  };

  const isCreateMode = mode === "create";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isCreateMode
          ? t("products.dialogs.createTitle")
          : t("products.dialogs.editTitle")}
      </DialogTitle>
      <Stack component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {validationError ? (
              <Alert severity="warning">{validationError}</Alert>
            ) : null}
            {error ? (
              <Alert severity="error">
                {getLocalizedApiErrorMessage(error, t)}
              </Alert>
            ) : null}
            <TextField
              name="name"
              label={t("products.columns.name")}
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="calories"
              label={t("products.columns.calories")}
              type="number"
              value={form.calories}
              onChange={handleChange}
              fullWidth
              required
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                name="proteins"
                label={t("products.columns.proteins")}
                type="number"
                value={form.proteins}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="fats"
                label={t("products.columns.fats")}
                type="number"
                value={form.fats}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="carbs"
                label={t("products.columns.carbs")}
                type="number"
                value={form.carbs}
                onChange={handleChange}
                fullWidth
                required
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            {t("actions.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting
              ? t("actions.saving")
              : isCreateMode
                ? t("products.actions.add")
                : t("actions.save")}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

export default ProductEditDialog;
