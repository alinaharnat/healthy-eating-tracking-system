import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateMeal, createMeal } from "../../features/meals/api";
import MealFormDialog from "../../features/meals/components/MealFormDialog";
import MealList from "../../features/meals/components/MealList";
import { useMealsByDate } from "../../features/meals/hooks/useMealsByDate";
import { useApiRequest } from "../../shared/hooks/useApiRequest";
import { useNotification } from "../../shared/ui/notifications/useNotification";
import SectionErrorState from "../../shared/ui/states/SectionErrorState";
import SectionLoadingState from "../../shared/ui/states/SectionLoadingState";

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function MealsPage() {
  const { t } = useTranslation(["meals", "common"]);
  const { notify } = useNotification();
  const [selectedDate, setSelectedDate] = useState(getTodayDateInputValue());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  const { meals, loadMeals, deleteMealOptimistic, isLoading, error, retry } =
    useMealsByDate(selectedDate);

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

  const isMutating = createRequest.isLoading || updateRequest.isLoading;

  const mutationError = useMemo(() => {
    return createRequest.error || updateRequest.error;
  }, [createRequest.error, updateRequest.error]);

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
    try {
      if (editingMeal?.id) {
        await updateRequest.run({
          mealId: editingMeal.id,
          payload,
        });

        notify({
          severity: "success",
          key: "meals.notifications.updated",
          namespace: "meals",
        });
      } else {
        await createRequest.run({ payload });

        notify({
          severity: "success",
          key: "meals.notifications.created",
          namespace: "meals",
        });
      }

      await loadMeals(selectedDate);
      closeFormDialog();
    } catch (requestError) {
      notify({
        severity: "error",
        message:
          requestError?.message ||
          t(
            editingMeal?.id
              ? "meals:notifications.updateFailed"
              : "meals:notifications.createFailed",
          ),
      });

      throw requestError;
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await deleteMealOptimistic(mealId);

      notify({
        severity: "success",
        key: "meals.notifications.deleted",
        namespace: "meals",
      });
    } catch (requestError) {
      notify({
        severity: "error",
        message: requestError?.message || t("meals:notifications.deleteFailed"),
      });
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
          error={mutationError}
        />
      ) : null}
    </Stack>
  );
}

export default MealsPage;
