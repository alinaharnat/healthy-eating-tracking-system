function toNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function toCleanString(value) {
  return String(value || "").trim();
}

function isObjectValue(value) {
  return Boolean(value) && typeof value === "object";
}

function extractCatalogProduct(dto = {}) {
  if (isObjectValue(dto.productId)) {
    return dto.productId;
  }

  if (isObjectValue(dto.product)) {
    return dto.product;
  }

  return null;
}

function resolveCatalogProductId(dto = {}, product = null) {
  if (product) {
    return toCleanString(product._id || product.id);
  }

  return toCleanString(dto.productId);
}

function resolveMealProductName({
  dto = {},
  product = null,
  custom = null,
  source,
}) {
  if (source === "custom") {
    return toCleanString(custom?.name || dto.productName);
  }

  // Use display names only and avoid normalized/internal identifiers.
  return toCleanString(product?.name || dto.productName);
}

export function mapMealProductModel(dto = {}) {
  const product = extractCatalogProduct(dto);
  const custom =
    dto.customProduct && typeof dto.customProduct === "object"
      ? dto.customProduct
      : null;

  const source = dto.source || (custom ? "custom" : "catalog");
  const nutritionSource = source === "custom" ? custom : product;

  const weightGrams = toNumber(dto.weightGrams);
  const caloriesPer100 = toNumber(nutritionSource?.calories);
  const proteinsPer100 = toNumber(nutritionSource?.proteins);
  const fatsPer100 = toNumber(nutritionSource?.fats);
  const carbsPer100 = toNumber(nutritionSource?.carbs);

  return {
    itemId: dto.itemId || dto._id || null,
    source,
    productId:
      source === "catalog" ? resolveCatalogProductId(dto, product) : null,
    productName: resolveMealProductName({ dto, product, custom, source }),
    customProduct:
      source === "custom"
        ? {
            name: custom?.name || "",
            calories: caloriesPer100,
            proteins: proteinsPer100,
            fats: fatsPer100,
            carbs: carbsPer100,
          }
        : null,
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

function mapCatalogMealProductWriteModel(item = {}) {
  const productId = String(item.productId || "").trim();
  const weightGrams = Number(item.weightGrams);

  return {
    productId,
    weightGrams,
  };
}

function mapCustomMealProductWriteModel(item = {}) {
  const customProduct = item.customProduct || {};
  const weightGrams = Number(item.weightGrams);

  return {
    customProduct: {
      name: String(customProduct.name || "").trim(),
      calories: Number(customProduct.calories),
      proteins: Number(customProduct.proteins),
      fats: Number(customProduct.fats),
      carbs: Number(customProduct.carbs),
    },
    weightGrams,
  };
}

function mapMealProductWriteModel(item = {}) {
  const isCustom = item.source === "custom" || Boolean(item.customProduct);

  if (isCustom) {
    return mapCustomMealProductWriteModel(item);
  }

  return mapCatalogMealProductWriteModel(item);
}

export function mapMealWritePayload(payload = {}) {
  const rawDate = payload.date;
  const parsedDate = new Date(rawDate);
  const date = Number.isNaN(parsedDate.getTime())
    ? rawDate
    : parsedDate.toISOString();

  const mealProducts = Array.isArray(payload.mealProducts)
    ? payload.mealProducts.map(mapMealProductWriteModel)
    : [];

  return {
    mealType: String(payload.mealType || "").trim(),
    date,
    mealProducts,
  };
}

export function isValidMealProductId(value) {
  return OBJECT_ID_PATTERN.test(String(value || "").trim());
}
