import apiClient from "../../../core/api";
import { mapMealList, mapMealModel } from "./mappers";

export async function createMeal(payload, options = {}) {
  const response = await apiClient.post("/meals", payload, options);
  return mapMealModel(response);
}

export async function addProductToMeal(mealId, payload, options = {}) {
  const response = await apiClient.post(
    `/meals/${mealId}/add-product`,
    payload,
    options,
  );

  return mapMealModel(response);
}

export async function removeProductFromMeal(mealId, productId, options = {}) {
  const response = await apiClient.request(`/meals/${mealId}/remove-product`, {
    ...options,
    method: "DELETE",
    body: {
      productId,
    },
  });

  return {
    message: response?.message || "Product removed",
    meal: mapMealModel(response?.meal || {}),
  };
}

export async function getMealsByDate({ date } = {}, options = {}) {
  const response = await apiClient.get("/meals/by-date", {
    ...options,
    query: {
      date,
    },
  });

  return mapMealList(response || []);
}

export async function getMealHistory({ period = "week" } = {}, options = {}) {
  const response = await apiClient.get("/meals/history", {
    ...options,
    query: {
      period,
    },
  });

  return mapMealList(response || []);
}

export async function updateMeal(mealId, payload, options = {}) {
  const response = await apiClient.put(`/meals/${mealId}`, payload, options);
  return mapMealModel(response);
}

export async function deleteMeal(mealId, options = {}) {
  const response = await apiClient.delete(`/meals/${mealId}`, options);

  return {
    message: response?.message || "Meal deleted successfully",
  };
}
