import { useCallback, useEffect } from "react";
import { deleteMeal, getMealsByDate } from "../api";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { useOptimisticList } from "../../../shared/hooks/useOptimisticList";

export function useMealsByDate(initialDate = null) {
  const {
    items: meals,
    setItems: setMeals,
    runOptimistic,
  } = useOptimisticList([]);

  const mealsRequest = useApiRequest(
    ({ date, signal }) =>
      getMealsByDate(
        { date },
        {
          signal,
        },
      ),
    {
      manual: true,
      retries: 1,
    },
  );

  const mealsRun = mealsRequest.run;

  const loadMeals = useCallback(
    async (date) => {
      const result = await mealsRun({ date });
      const safeResult = result || [];
      setMeals(safeResult);
      return safeResult;
    },
    [mealsRun, setMeals],
  );

  useEffect(() => {
    if (!initialDate) {
      return;
    }

    loadMeals(initialDate).catch(() => null);
  }, [initialDate, loadMeals]);

  const retry = useCallback(() => {
    if (!initialDate) {
      return Promise.resolve([]);
    }

    return loadMeals(initialDate);
  }, [initialDate, loadMeals]);

  const deleteMealOptimistic = useCallback(
    async (mealId) => {
      return runOptimistic({
        apply: (currentMeals) =>
          currentMeals.filter((meal) => meal.id !== mealId),
        mutation: () => deleteMeal(mealId),
      });
    },
    [runOptimistic],
  );

  return {
    meals,
    setMeals,
    loadMeals,
    deleteMealOptimistic,
    isLoading: mealsRequest.isLoading,
    error: mealsRequest.error,
    retry,
    cancel: mealsRequest.cancel,
  };
}
