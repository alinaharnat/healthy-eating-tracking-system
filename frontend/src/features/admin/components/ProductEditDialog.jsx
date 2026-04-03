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
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
}) {
  const { t } = useTranslation("admin");
  const [form, setForm] = useState(mapProductToForm(product));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!product?.id) {
      return;
    }

    await onSubmit({
      productId: product.id,
      payload: {
        name: form.name,
        calories: Number(form.calories),
        proteins: Number(form.proteins),
        fats: Number(form.fats),
        carbs: Number(form.carbs),
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("products.dialogs.editTitle")}</DialogTitle>
      <Stack component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error.message}</Alert> : null}
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
            {isSubmitting ? t("actions.saving") : t("actions.save")}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

export default ProductEditDialog;
