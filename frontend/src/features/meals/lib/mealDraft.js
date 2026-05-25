import { isValidMealProductId } from "../api/mappers";

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
export const DEFAULT_MEAL_TYPE = "breakfast";
export const DEFAULT_WEIGHT_GRAMS = 100;

/** @typedef {"catalog" | "custom"} MealProductSource */

/**
 * @typedef {Object} MealDraftCustomProduct
 * @property {string} name
 * @property {number} calories
 * @property {number} proteins
 * @property {number} fats
 * @property {number} carbs
 */

/**
 * @typedef {Object} MealDraftItem
 * @property {string | null} itemId
 * @property {MealProductSource} source
 * @property {string | null} productId
 * @property {string} productName
 * @property {MealDraftCustomProduct | null} customProduct
 * @property {number} weightGrams
 * @property {number} calories
 * @property {number} proteins
 * @property {number} fats
 * @property {number} carbs
 */

/**
 * @typedef {Object} MealDraftState
 * @property {string} mealType
 * @property {string} date
 * @property {MealDraftItem[]} mealProducts
 */

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toCleanString(value) {
  return String(value || "").trim();
}

function getCatalogProductShape(item = {}) {
  if (item.productId && typeof item.productId === "object") {
    return item.productId;
  }

  if (item.product && typeof item.product === "object") {
    return item.product;
  }

  return null;
}

function buildDefaultDate() {
  return toDateTimeLocalValue(new Date());
}

export function toDateTimeLocalValue(value) {
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

export function createEmptyMealDraft() {
  return {
    mealType: DEFAULT_MEAL_TYPE,
    date: buildDefaultDate(),
    mealProducts: [],
  };
}

function mapRawMealItem(rawItem = {}) {
  const item = rawItem || {};
  const catalogProduct = getCatalogProductShape(item);
  const source =
    item.source ||
    (item.customProduct && !item.productId ? "custom" : "catalog");
  const customProduct =
    source === "custom" && item.customProduct
      ? {
          name: String(item.customProduct.name || "").trim(),
          calories: toNumber(item.customProduct.calories),
          proteins: toNumber(item.customProduct.proteins),
          fats: toNumber(item.customProduct.fats),
          carbs: toNumber(item.customProduct.carbs),
        }
      : null;

  const weightGrams = toNumber(item.weightGrams);
  const caloriesPer100 = toNumber(
    customProduct?.calories ?? item.caloriesPer100,
  );
  const proteinsPer100 = toNumber(
    customProduct?.proteins ?? item.proteinsPer100,
  );
  const fatsPer100 = toNumber(customProduct?.fats ?? item.fatsPer100);
  const carbsPer100 = toNumber(customProduct?.carbs ?? item.carbsPer100);

  return {
    itemId: item.itemId || item._id || null,
    source,
    productId:
      source === "catalog"
        ? toCleanString(
            catalogProduct?._id || catalogProduct?.id || item.productId,
          ) || null
        : null,
    productName: toCleanString(
      item.productName || catalogProduct?.name || customProduct?.name || "",
    ),
    customProduct,
    weightGrams,
    calories: (caloriesPer100 * weightGrams) / 100,
    proteins: (proteinsPer100 * weightGrams) / 100,
    fats: (fatsPer100 * weightGrams) / 100,
    carbs: (carbsPer100 * weightGrams) / 100,
  };
}

export function mapMealToDraft(meal) {
  if (!meal) {
    return createEmptyMealDraft();
  }

  return {
    mealType: meal.mealType || DEFAULT_MEAL_TYPE,
    date: toDateTimeLocalValue(meal.date) || buildDefaultDate(),
    mealProducts: Array.isArray(meal.mealProducts)
      ? meal.mealProducts.map((item) => {
          const caloriesPer100 =
            (toNumber(item.calories) * 100) /
            Math.max(toNumber(item.weightGrams), 1);
          const proteinsPer100 =
            (toNumber(item.proteins) * 100) /
            Math.max(toNumber(item.weightGrams), 1);
          const fatsPer100 =
            (toNumber(item.fats) * 100) /
            Math.max(toNumber(item.weightGrams), 1);
          const carbsPer100 =
            (toNumber(item.carbs) * 100) /
            Math.max(toNumber(item.weightGrams), 1);

          return mapRawMealItem({
            ...item,
            caloriesPer100,
            proteinsPer100,
            fatsPer100,
            carbsPer100,
          });
        })
      : [],
  };
}

export function createCatalogDraftItem(
  product = {},
  weightGrams = DEFAULT_WEIGHT_GRAMS,
) {
  const parsedWeight = toNumber(weightGrams);
  const safeWeight = parsedWeight > 0 ? parsedWeight : DEFAULT_WEIGHT_GRAMS;
  const caloriesPer100 = toNumber(product.calories);
  const proteinsPer100 = toNumber(product.proteins);
  const fatsPer100 = toNumber(product.fats);
  const carbsPer100 = toNumber(product.carbs);

  return {
    itemId: null,
    source: "catalog",
    productId: String(product.id || product._id || "").trim() || null,
    productName: String(product.name || "").trim(),
    customProduct: null,
    weightGrams: safeWeight,
    calories: (caloriesPer100 * safeWeight) / 100,
    proteins: (proteinsPer100 * safeWeight) / 100,
    fats: (fatsPer100 * safeWeight) / 100,
    carbs: (carbsPer100 * safeWeight) / 100,
  };
}

function getBaseNutrition(item) {
  if (item.source === "custom" && item.customProduct) {
    return {
      calories: toNumber(item.customProduct.calories),
      proteins: toNumber(item.customProduct.proteins),
      fats: toNumber(item.customProduct.fats),
      carbs: toNumber(item.customProduct.carbs),
    };
  }

  const currentWeight = Math.max(toNumber(item.weightGrams), 1);
  return {
    calories: (toNumber(item.calories) * 100) / currentWeight,
    proteins: (toNumber(item.proteins) * 100) / currentWeight,
    fats: (toNumber(item.fats) * 100) / currentWeight,
    carbs: (toNumber(item.carbs) * 100) / currentWeight,
  };
}

export function updateDraftItemWeight(item, nextWeightGrams) {
  const weightGrams = toNumber(nextWeightGrams);
  const base = getBaseNutrition(item);

  return {
    ...item,
    weightGrams,
    calories: (base.calories * weightGrams) / 100,
    proteins: (base.proteins * weightGrams) / 100,
    fats: (base.fats * weightGrams) / 100,
    carbs: (base.carbs * weightGrams) / 100,
  };
}

export function mergeCatalogDraftItem(items = [], nextItem) {
  if (!nextItem?.productId || nextItem.source === "custom") {
    return {
      items: [...items, nextItem],
      merged: false,
    };
  }

  const existingIndex = items.findIndex(
    (item) =>
      item.source === "catalog" &&
      String(item.productId) === String(nextItem.productId),
  );

  if (existingIndex < 0) {
    return {
      items: [...items, nextItem],
      merged: false,
    };
  }

  const existing = items[existingIndex];
  const mergedWeight =
    toNumber(existing.weightGrams) + toNumber(nextItem.weightGrams);
  const updated = updateDraftItemWeight(existing, mergedWeight);

  return {
    items: items.map((item, index) =>
      index === existingIndex ? updated : item,
    ),
    merged: true,
  };
}

export function validateMealDraft(draft, t) {
  const translate = (key, fallback, values) =>
    typeof t === "function" ? t(key, values) : fallback;

  const errors = [];

  if (!draft.date) {
    errors.push(
      translate("meals:form.validation.dateRequired", "Meal date is required."),
    );
  } else if (Number.isNaN(new Date(draft.date).getTime())) {
    errors.push(
      translate(
        "meals:form.validation.invalidDate",
        "Please provide a valid meal date.",
      ),
    );
  }

  if (!draft.mealType) {
    errors.push(
      translate(
        "meals:form.validation.mealTypeRequired",
        "Meal type is required.",
      ),
    );
  } else if (!MEAL_TYPES.includes(draft.mealType)) {
    errors.push(
      translate(
        "meals:form.validation.invalidMealType",
        "Invalid meal type selected.",
      ),
    );
  }

  if (!Array.isArray(draft.mealProducts) || draft.mealProducts.length === 0) {
    errors.push(
      translate(
        "meals:form.validation.productsRequired",
        "Add at least one meal item before saving.",
      ),
    );
    return errors;
  }

  draft.mealProducts.forEach((item, index) => {
    const position = index + 1;
    const label = item.productName || `#${position}`;
    const weight = toNumber(item.weightGrams);

    if (!Number.isFinite(weight) || weight <= 0) {
      errors.push(
        translate(
          "meals:form.validation.invalidWeightGrams",
          `Item ${label}: weight must be greater than 0 grams.`,
          { name: label },
        ),
      );
    }

    if (item.source === "custom") {
      const custom = item.customProduct || {};
      const macros = [
        custom.calories,
        custom.proteins,
        custom.fats,
        custom.carbs,
      ].map(toNumber);
      const hasInvalidNutrition = macros.some(
        (value) => !Number.isFinite(value) || value < 0,
      );

      if (!String(custom.name || "").trim() || hasInvalidNutrition) {
        errors.push(
          translate(
            "meals:form.validation.invalidCustomProduct",
            `Item ${label}: custom product data is invalid.`,
            { name: label },
          ),
        );
      }

      return;
    }

    if (!isValidMealProductId(item.productId)) {
      errors.push(
        translate(
          "meals:form.validation.invalidProductId",
          `Item ${label}: invalid product selected.`,
          { name: label },
        ),
      );
    }
  });

  return errors;
}

export function toMealWritePayload(draft) {
  return {
    mealType: draft.mealType,
    date: new Date(draft.date).toISOString(),
    mealProducts: draft.mealProducts.map((item) => {
      const weightGrams = Number(item.weightGrams);

      if (item.source === "custom" && item.customProduct) {
        return {
          customProduct: {
            name: String(item.customProduct.name || "").trim(),
            calories: Number(item.customProduct.calories),
            proteins: Number(item.customProduct.proteins),
            fats: Number(item.customProduct.fats),
            carbs: Number(item.customProduct.carbs),
          },
          weightGrams,
        };
      }

      return {
        productId: String(item.productId || "").trim(),
        weightGrams,
      };
    }),
  };
}
