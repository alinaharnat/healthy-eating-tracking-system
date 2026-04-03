import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductSearchDialog from "./ProductSearchDialog";

function toDateTimeLocalValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function getDefaultDate() {
  return toDateTimeLocalValue(new Date());
}

function buildInitialState(initialMeal) {
  if (!initialMeal) {
    return {
      mealType: "breakfast",
      date: getDefaultDate(),
      mealProducts: [],
    };
  }

  return {
    mealType: initialMeal.mealType || "breakfast",
    date: toDateTimeLocalValue(initialMeal.date) || getDefaultDate(),
    mealProducts: Array.isArray(initialMeal.mealProducts)
      ? initialMeal.mealProducts.map((item) => ({
          productId: item.productId,
          productName: item.productName || item.productId,
          weightGrams: item.weightGrams,
        }))
      : [],
  };
}

function MealFormDialog({
  open,
  initialMeal,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const { t } = useTranslation(["meals", "common"]);
  const [formState, setFormState] = useState(buildInitialState(initialMeal));
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const isEditMode = Boolean(initialMeal?.id);

  const totalCalories = useMemo(
    () =>
      formState.mealProducts.reduce((sum, item) => {
        return sum + (Number(item.calories) || 0);
      }, 0),
    [formState.mealProducts],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (product) => {
    setFormState((prev) => ({
      ...prev,
      mealProducts: [...prev.mealProducts, product],
    }));
  };

  const handleRemoveProduct = (index) => {
    setFormState((prev) => ({
      ...prev,
      mealProducts: prev.mealProducts.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      mealType: formState.mealType,
      date: new Date(formState.date).toISOString(),
      mealProducts: formState.mealProducts.map((product) => ({
        productId: product.productId,
        weightGrams: Number(product.weightGrams),
      })),
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {isEditMode ? t("meals:form.editTitle") : t("meals:form.createTitle")}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  name="mealType"
                  label={t("meals:form.mealType")}
                  value={formState.mealType}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="breakfast">
                    {t("meals:types.breakfast")}
                  </MenuItem>
                  <MenuItem value="lunch">{t("meals:types.lunch")}</MenuItem>
                  <MenuItem value="dinner">{t("meals:types.dinner")}</MenuItem>
                  <MenuItem value="snack">{t("meals:types.snack")}</MenuItem>
                </TextField>

                <TextField
                  name="date"
                  label={t("meals:form.date")}
                  type="datetime-local"
                  value={formState.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
              >
                <Typography variant="subtitle1">
                  {t("meals:form.products")}
                </Typography>
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setIsProductDialogOpen(true)}
                >
                  {t("meals:form.addProduct")}
                </Button>
              </Stack>

              {formState.mealProducts.length === 0 ? (
                <Typography color="text.secondary">
                  {t("meals:form.emptyProducts")}
                </Typography>
              ) : (
                <List disablePadding>
                  {formState.mealProducts.map((product, index) => (
                    <ListItem
                      key={`${product.productId}-${index}`}
                      disablePadding
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      }
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={product.productName || product.productId}
                        secondary={`${product.weightGrams} g`}
                      />
                      <Chip
                        size="small"
                        label={product.weightGrams + " g"}
                        sx={{ mr: 6 }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {totalCalories > 0 ? (
                <Typography color="text.secondary">
                  {t("meals:form.totalCalories", {
                    value: totalCalories.toFixed(0),
                  })}
                </Typography>
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>{t("common:actions.cancel")}</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || formState.mealProducts.length === 0}
            >
              {isSubmitting
                ? t("meals:form.saving")
                : isEditMode
                  ? t("meals:form.update")
                  : t("meals:form.create")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ProductSearchDialog
        open={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onConfirm={handleAddProduct}
      />
    </>
  );
}

export default MealFormDialog;
