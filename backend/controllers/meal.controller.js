import Meal from "../models/Meal.js";

export const createMeal = async (req, res) => {
  try {
    const { userId, date, mealType, mealProducts } = req.body;

    if (!userId || !!date || !mealType || !mealProducts) {
      return res
        .status(400)
        .json({ message: "error: missing required fields" });
    }

    if (!Array.isArray(mealProducts) || mealProducts.length === 0) {
      return res
        .status(400)
        .json({ message: "error: mealProducts must be a non-empty array" });
    }

    const userExist = await User.findbyId(userId);

    if (!userExist) {
      return res.status(404).json({ message: "error: user not found" });
    }

    for (const mp of mealProducts) {
      const prod = await Product.findById(mp.productId);
      if (!prod) {
        return res
          .status(404)
          .json({ message: `Product not found: ${mp.productId}` });
      }
    }

    const newMeal = await Meal.create({
      userId,
      date,
      mealType,
      mealProducts,
    });
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProductToMeal = async (req, res) => {
  const mealId = req.params;
  const { productId, weightGrams } = req.body;
  try {
    if (!productId || !weightGrams) {
      return res
        .status(400)
        .json({ message: "productId & weightGrams required" });
    }

    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newMealProduct = { productId, weightGrams };

    meal.mealProducts.push(newMealProduct);

    await meal.save();

    res.status(200).json(meal);
  } catch (error) {
    console.error("Error adding product to meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProductFromMeal = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    const updatedMeal = await Meal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        $pull: {
          mealProducts: { productId },
        },
      },
      {
        new: true,
      }
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    return res.json({
      message: "Product removed",
      meal: updatedMeal,
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

  const items = await Meal.find({
    userId: req.user._id,
    date: { $gte: start, $lte: end },
  }).sort({ date: 1 });

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

    const items = await Meal.find({
      userId: req.user._id,
      date: { $gte: from, $lte: now },
    }).sort({ date: -1 });

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
    const updatedMeal = await Meal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    return res.json(updatedMeal);
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
