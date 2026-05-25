import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  mapMealToDraft,
  mergeCatalogDraftItem,
  toMealWritePayload,
  updateDraftItemWeight,
  validateMealDraft,
} from "../lib/mealDraft";
import CustomProductForm from "./CustomProductForm";
import MealItemsList from "./MealItemsList";
import ProductSearchField from "./ProductSearchField";

function MealEntryForm({
  initialMeal,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}) {
  const { t } = useTranslation(["meals", "common"]);
  const [formState, setFormState] = useState(() => mapMealToDraft(initialMeal));
  const [validationErrors, setValidationErrors] = useState([]);
  const [draftInfoMessage, setDraftInfoMessage] = useState("");

  const isEditMode = Boolean(initialMeal?.id);

  const totals = useMemo(() => {
    return formState.mealProducts.reduce(
      (acc, item) => {
        acc.calories += Number(item.calories) || 0;
        acc.proteins += Number(item.proteins) || 0;
        acc.fats += Number(item.fats) || 0;
        acc.carbs += Number(item.carbs) || 0;
        return acc;
      },
      {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
      },
    );
  }, [formState.mealProducts]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValidationErrors([]);

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = (item) => {
    setValidationErrors([]);

    if (item.source === "catalog") {
      const result = mergeCatalogDraftItem(formState.mealProducts, item);

      setFormState((prev) => ({
        ...prev,
        mealProducts: result.items,
      }));

      setDraftInfoMessage(
        result.merged
          ? t("meals:form.validation.duplicateMerged", {
              name: item.productName,
            })
          : "",
      );

      return;
    }

    setFormState((prev) => ({
      ...prev,
      mealProducts: [...prev.mealProducts, item],
    }));

    setDraftInfoMessage("");
  };

  const handleRemoveItem = (index) => {
    setValidationErrors([]);

    setFormState((prev) => ({
      ...prev,
      mealProducts: prev.mealProducts.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const handleUpdateItemWeight = (index, nextWeightGrams) => {
    setValidationErrors([]);

    setFormState((prev) => ({
      ...prev,
      mealProducts: prev.mealProducts.map((item, itemIndex) =>
        itemIndex === index
          ? updateDraftItemWeight(item, nextWeightGrams)
          : item,
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationErrors([]);
    setDraftInfoMessage("");

    const errors = validateMealDraft(formState, t);

    if (errors.length) {
      setValidationErrors(errors);
      return;
    }

    try {
      await onSubmit(toMealWritePayload(formState));
    } catch {
      return;
    }
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          name="mealType"
          label={t("form.mealType")}
          value={formState.mealType}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="breakfast">{t("types.breakfast")}</MenuItem>
          <MenuItem value="lunch">{t("types.lunch")}</MenuItem>
          <MenuItem value="dinner">{t("types.dinner")}</MenuItem>
          <MenuItem value="snack">{t("types.snack")}</MenuItem>
        </TextField>

        <TextField
          name="date"
          label={t("form.date")}
          type="datetime-local"
          value={formState.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Stack>

      {validationErrors.length ? (
        <Alert severity="warning">
          {validationErrors.map((message, index) => (
            <Typography key={`${message}-${index}`} variant="body2">
              {message}
            </Typography>
          ))}
        </Alert>
      ) : null}

      {draftInfoMessage ? (
        <Alert severity="info">{draftInfoMessage}</Alert>
      ) : null}

      {error ? <Alert severity="error">{error.message}</Alert> : null}

      <Typography variant="subtitle1">{t("form.products")}</Typography>

      <ProductSearchField
        onAddProduct={handleAddItem}
        disabled={isSubmitting}
      />

      <CustomProductForm
        onAddCustomProduct={handleAddItem}
        disabled={isSubmitting}
      />

      <MealItemsList
        items={formState.mealProducts}
        onRemoveItem={handleRemoveItem}
        onUpdateItemWeight={handleUpdateItemWeight}
        disabled={isSubmitting}
      />

      <Typography color="text.secondary">
        {t("form.totalCalories", {
          value: totals.calories.toFixed(0),
        })}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {t("form.totalMacros", {
          proteins: totals.proteins.toFixed(1),
          fats: totals.fats.toFixed(1),
          carbs: totals.carbs.toFixed(1),
        })}
      </Typography>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button onClick={onCancel}>{t("common:actions.cancel")}</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !formState.mealProducts.length}
        >
          {isSubmitting
            ? t("form.saving")
            : isEditMode
              ? t("form.update")
              : t("form.create")}
        </Button>
      </Stack>
    </Stack>
  );
}

export default MealEntryForm;
