import { useCallback } from "react";
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
      manual: !initialDate,
      retries: 1,
      immediateParams: initialDate ? { date: initialDate } : undefined,
    },
  );

  const loadMeals = useCallback(
    async (date) => {
      const result = await mealsRequest.run({ date });
      setMeals(result);
      return result;
    },
    [mealsRequest, setMeals],
  );

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
    retry: mealsRequest.retry,
    cancel: mealsRequest.cancel,
  };
}
