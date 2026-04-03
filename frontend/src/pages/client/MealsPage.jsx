import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addProductToMeal,
  removeProductFromMeal,
  updateMeal,
  createMeal,
} from "../../features/meals/api";
import MealFormDialog from "../../features/meals/components/MealFormDialog";
import MealList from "../../features/meals/components/MealList";
import ProductSearchDialog from "../../features/meals/components/ProductSearchDialog";
import { useMealsByDate } from "../../features/meals/hooks/useMealsByDate";
import { useApiRequest } from "../../shared/hooks/useApiRequest";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function MealsPage() {
  const { t } = useTranslation(["meals", "common"]);
  const [selectedDate, setSelectedDate] = useState(getTodayDateInputValue());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [productTargetMeal, setProductTargetMeal] = useState(null);

  const {
    meals,
    setMeals,
    loadMeals,
    deleteMealOptimistic,
    isLoading,
    error,
    retry,
  } = useMealsByDate(selectedDate);

  const createRequest = useApiRequest(
    ({ payload, signal }) => createMeal(payload, { signal }),
    {
      manual: true,
    },
  );

  const updateRequest = useApiRequest(
    ({ mealId, payload, signal }) => updateMeal(mealId, payload, { signal }),
    {
      manual: true,
    },
  );

  const addProductRequest = useApiRequest(
    ({ mealId, payload, signal }) =>
      addProductToMeal(mealId, payload, { signal }),
    {
      manual: true,
    },
  );

  const removeProductRequest = useApiRequest(
    ({ mealId, productId, signal }) =>
      removeProductFromMeal(mealId, productId, { signal }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    loadMeals(selectedDate).catch(() => null);
  }, [loadMeals, selectedDate]);

  const isMutating =
    createRequest.isLoading ||
    updateRequest.isLoading ||
    addProductRequest.isLoading ||
    removeProductRequest.isLoading;

  const mutationError = useMemo(() => {
    return (
      createRequest.error ||
      updateRequest.error ||
      addProductRequest.error ||
      removeProductRequest.error
    );
  }, [
    addProductRequest.error,
    createRequest.error,
    removeProductRequest.error,
    updateRequest.error,
  ]);

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setEditingMeal(null);
  };

  const handleCreateClick = () => {
    setEditingMeal(null);
    setIsFormOpen(true);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setIsFormOpen(true);
  };

  const handleSaveMeal = async (payload) => {
    if (editingMeal?.id) {
      await updateRequest.run({
        mealId: editingMeal.id,
        payload,
      });
    } else {
      await createRequest.run({ payload });
    }

    await loadMeals(selectedDate);
    closeFormDialog();
  };

  const handleDeleteMeal = async (mealId) => {
    await deleteMealOptimistic(mealId);
  };

  const handleAddProductToMeal = async (productPayload) => {
    if (!productTargetMeal?.id) {
      return;
    }

    const updatedMeal = await addProductRequest.run({
      mealId: productTargetMeal.id,
      payload: productPayload,
    });

    setMeals((currentMeals) =>
      currentMeals.map((meal) =>
        meal.id === updatedMeal.id ? updatedMeal : meal,
      ),
    );
    setProductTargetMeal(null);
  };

  const handleRemoveProductFromMeal = async (mealId, productId) => {
    const result = await removeProductRequest.run({
      mealId,
      productId,
    });

    if (result?.meal) {
      setMeals((currentMeals) =>
        currentMeals.map((meal) =>
          meal.id === result.meal.id ? result.meal : meal,
        ),
      );
    }
  };

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("meals:title")}</Typography>
            <Typography color="text.secondary">
              {t("meals:description")}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              type="date"
              label={t("meals:filter.date")}
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleCreateClick}
            >
              {t("meals:actions.create")}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {mutationError ? (
        <Alert severity="error">{mutationError.message}</Alert>
      ) : null}

      {error ? (
        <SectionErrorState
          message={error.message}
          onRetry={retry}
          retryLabel={t("common:actions.retry")}
        />
      ) : isLoading ? (
        <SectionLoadingState label={t("common:states.loading")} />
      ) : (
        <MealList
          meals={meals}
          onCreate={handleCreateClick}
          onEdit={handleEditMeal}
          onDelete={handleDeleteMeal}
          onAddProduct={setProductTargetMeal}
          onRemoveProduct={handleRemoveProductFromMeal}
          isMutating={isMutating}
        />
      )}

      {isFormOpen ? (
        <MealFormDialog
          open={isFormOpen}
          initialMeal={editingMeal}
          onClose={closeFormDialog}
          onSubmit={handleSaveMeal}
          isSubmitting={createRequest.isLoading || updateRequest.isLoading}
        />
      ) : null}

      <ProductSearchDialog
        open={Boolean(productTargetMeal)}
        onClose={() => setProductTargetMeal(null)}
        onConfirm={handleAddProductToMeal}
      />
    </Stack>
  );
}

export default MealsPage;
