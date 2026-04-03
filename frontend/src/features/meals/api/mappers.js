function toNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function mapMealProductModel(dto = {}) {
  const product =
    dto.productId && typeof dto.productId === "object" ? dto.productId : null;

  const weightGrams = toNumber(dto.weightGrams);
  const caloriesPer100 = toNumber(product?.calories);
  const proteinsPer100 = toNumber(product?.proteins);
  const fatsPer100 = toNumber(product?.fats);
  const carbsPer100 = toNumber(product?.carbs);

  return {
    productId: (product && (product._id || product.id)) || dto.productId || "",
    productName: product?.name || "",
    weightGrams,
    calories: (caloriesPer100 * weightGrams) / 100,
    proteins: (proteinsPer100 * weightGrams) / 100,
    fats: (fatsPer100 * weightGrams) / 100,
    carbs: (carbsPer100 * weightGrams) / 100,
  };
}

export function mapMealModel(dto = {}) {
  const mealProducts = Array.isArray(dto.mealProducts)
    ? dto.mealProducts.map(mapMealProductModel)
    : [];

  const totals = mealProducts.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.proteins += item.proteins;
      acc.fats += item.fats;
      acc.carbs += item.carbs;
      return acc;
    },
    {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0,
    },
  );

  return {
    id: dto.id || dto._id || "",
    userId: dto.userId || null,
    mealType: dto.mealType || "",
    date: dto.date || null,
    mealProducts,
    totals,
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
  };
}

export function mapMealList(items = []) {
  return items.map(mapMealModel);
}
