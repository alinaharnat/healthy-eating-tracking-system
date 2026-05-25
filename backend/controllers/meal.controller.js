import Meal from "../models/meal.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const ALLOWED_MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
const MEAL_PRODUCT_POPULATE = {
  path: "mealProducts.productId",
  select: "name calories proteins fats carbs",
};

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

function normalizeMealDate(rawDate) {
  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function normalizeCustomProduct(rawCustomProduct = {}) {
  const name = String(rawCustomProduct.name || "").trim();
  const calories = Number(rawCustomProduct.calories);
  const proteins = Number(rawCustomProduct.proteins);
  const fats = Number(rawCustomProduct.fats);
  const carbs = Number(rawCustomProduct.carbs);

  if (!name) {
    return { error: "Custom product name is required" };
  }

  if (
    [calories, proteins, fats, carbs].some(
      (value) => !Number.isFinite(value) || value < 0,
    )
  ) {
    return {
      error:
        "Custom product nutrition values must be valid non-negative numbers",
    };
  }

  return {
    value: {
      name,
      calories,
      proteins,
      fats,
      carbs,
    },
  };
}

async function normalizeMealProducts(rawMealProducts = []) {
  if (!Array.isArray(rawMealProducts) || rawMealProducts.length === 0) {
    return {
      error: "mealProducts must be a non-empty array",
    };
  }

  const normalizedItems = [];
  const productIds = new Set();

  for (let index = 0; index < rawMealProducts.length; index += 1) {
    const item = rawMealProducts[index] || {};
    const itemNumber = index + 1;
    const hasProductId = Boolean(item.productId);
    const hasCustomProduct = Boolean(item.customProduct);
    const weightGrams = Number(item.weightGrams);

    if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
      return {
        error: `mealProducts[${itemNumber}] has invalid weightGrams`,
      };
    }

    if (
      (hasProductId && hasCustomProduct) ||
      (!hasProductId && !hasCustomProduct)
    ) {
      return {
        error: `mealProducts[${itemNumber}] must contain either productId or customProduct`,
      };
    }

    if (hasProductId) {
      if (!isValidObjectId(item.productId)) {
        return {
          error: `mealProducts[${itemNumber}] has invalid productId`,
        };
      }

      const productId = String(item.productId);
      productIds.add(productId);

      normalizedItems.push({
        source: "catalog",
        productId,
        weightGrams,
      });
      continue;
    }

    const customProductResult = normalizeCustomProduct(item.customProduct);

    if (customProductResult.error) {
      return {
        error: `mealProducts[${itemNumber}] ${customProductResult.error}`,
      };
    }

    normalizedItems.push({
      source: "custom",
      customProduct: customProductResult.value,
      weightGrams,
    });
  }

  if (productIds.size > 0) {
    const existingProducts = await Product.find(
      {
        _id: { $in: Array.from(productIds) },
      },
      "_id",
    );

    const existingIds = new Set(
      existingProducts.map((item) => String(item._id)),
    );
    const missingIds = Array.from(productIds).filter(
      (id) => !existingIds.has(id),
    );

    if (missingIds.length > 0) {
      return {
        error: `Products not found: ${missingIds.join(", ")}`,
      };
    }
  }

  return {
    value: normalizedItems,
  };
}

function getMealOwnerId(req, rawUserId) {
  if (req.user.role === "admin" && rawUserId) {
    return rawUserId;
  }

  return req.user._id;
}

function getMealAccessCriteria(req, mealId) {
  if (req.user.role === "admin") {
    return {
      _id: mealId,
    };
  }

  return {
    _id: mealId,
    userId: req.user._id,
  };
}

async function getPopulatedMealById(mealId) {
  return Meal.findById(mealId).populate(MEAL_PRODUCT_POPULATE);
}

function withMealProductPopulation(query) {
  return query.populate(MEAL_PRODUCT_POPULATE);
}

export const createMeal = async (req, res) => {
  try {
    const { userId: requestedUserId, date, mealType, mealProducts } = req.body;
    const userId = getMealOwnerId(req, requestedUserId);

    if (!userId || !date || !mealType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!ALLOWED_MEAL_TYPES.includes(mealType)) {
      return res.status(400).json({ message: "Invalid mealType" });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const mealDate = normalizeMealDate(date);

    if (!mealDate) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const normalizedProductsResult = await normalizeMealProducts(mealProducts);

    if (normalizedProductsResult.error) {
      return res.status(400).json({ message: normalizedProductsResult.error });
    }

    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const createdMeal = await Meal.create({
      userId,
      date: mealDate,
      mealType,
      mealProducts: normalizedProductsResult.value,
    });

    const populatedMeal = await getPopulatedMealById(createdMeal._id);

    return res.status(201).json(populatedMeal);
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProductToMeal = async (req, res) => {
  try {
    const mealId = req.params.id;

    const normalizedProductsResult = await normalizeMealProducts([req.body]);

    if (normalizedProductsResult.error) {
      return res.status(400).json({ message: normalizedProductsResult.error });
    }

    const meal = await Meal.findOne(getMealAccessCriteria(req, mealId));

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    meal.mealProducts.push(normalizedProductsResult.value[0]);

    await meal.save();

    const populatedMeal = await getPopulatedMealById(meal._id);

    res.status(200).json(populatedMeal);
  } catch (error) {
    console.error("Error adding product to meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProductFromMeal = async (req, res) => {
  try {
    const { productId, itemId } = req.body;

    if (!itemId && !productId) {
      return res
        .status(400)
        .json({ message: "itemId or productId is required" });
    }

    const meal = await Meal.findOne(getMealAccessCriteria(req, req.params.id));

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const initialLength = meal.mealProducts.length;

    meal.mealProducts = meal.mealProducts.filter((item) => {
      if (itemId) {
        return String(item._id) !== String(itemId);
      }

      return String(item.productId) !== String(productId);
    });

    if (meal.mealProducts.length === initialLength) {
      return res.status(404).json({ message: "Meal product not found" });
    }

    await meal.save();

    const populatedMeal = await getPopulatedMealById(meal._id);

    return res.json({
      message: "Product removed",
      meal: populatedMeal,
    });
  } catch (error) {
    console.error("Remove product error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getMealsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "date required (YYYY-MM-DD)" });
  }

  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  const items = await withMealProductPopulation(
    Meal.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    }),
  ).sort({ date: 1 });

  res.json(items);
};

export const getMealsHistory = async (req, res) => {
  try {
    const { period } = req.query;

    const now = new Date();

    const from = new Date(now);

    if (period === "month") {
      from.setMonth(from.getMonth() - 1);
    } else {
      from.setDate(from.getDate() - 7);
    }

    const items = await withMealProductPopulation(
      Meal.find({
        userId: req.user._id,
        date: { $gte: from, $lte: now },
      }),
    ).sort({ date: -1 });

    return res.json(items);
  } catch (error) {
    console.error("History error:", error);

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne(getMealAccessCriteria(req, req.params.id));

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const { mealType, date, mealProducts } = req.body;

    if (mealType !== undefined) {
      if (!ALLOWED_MEAL_TYPES.includes(mealType)) {
        return res.status(400).json({ message: "Invalid mealType" });
      }

      meal.mealType = mealType;
    }

    if (date !== undefined) {
      const normalizedDate = normalizeMealDate(date);

      if (!normalizedDate) {
        return res.status(400).json({ message: "Invalid date" });
      }

      meal.date = normalizedDate;
    }

    if (mealProducts !== undefined) {
      const normalizedProductsResult =
        await normalizeMealProducts(mealProducts);

      if (normalizedProductsResult.error) {
        return res
          .status(400)
          .json({ message: normalizedProductsResult.error });
      }

      meal.mealProducts = normalizedProductsResult.value;
    }

    await meal.save();

    const populatedMeal = await getPopulatedMealById(meal._id);

    return res.json(populatedMeal);
  } catch (error) {
    console.error("Update meal error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const deletedMeal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    return res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Delete meal error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
