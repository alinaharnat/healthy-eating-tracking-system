import Meal from "../models/meal.js";
import IoTMeasurement from "../models/iotMeasurement.js";
import Recommendation from "../models/recommendation.js";
import User from "../models/user.js";
import mongoose from "mongoose";

//Допоміжна функція: підрахунок БЖВ і калорій

function aggregateNutrition(meals) {
  const totals = {
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
  };

  meals.forEach((meal) => {
    meal.mealProducts.forEach((item) => {
      const p = item.productId;
      if (!p) return;

      const factor = item.weightGrams / 100;

      totals.calories += (p.calories || 0) * factor;
      totals.proteins += (p.proteins || 0) * factor;
      totals.fats += (p.fats || 0) * factor;
      totals.carbs += (p.carbs || 0) * factor;
    });
  });

  return totals;
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

async function resolveTargetUserId(req, rawUserId) {
  if (!rawUserId) {
    return {
      userId: req.user._id,
      statusCode: null,
      message: null,
    };
  }

  if (!isValidObjectId(rawUserId)) {
    return {
      userId: null,
      statusCode: 400,
      message: "Invalid userId",
    };
  }

  if (String(rawUserId) === String(req.user._id)) {
    return {
      userId: rawUserId,
      statusCode: null,
      message: null,
    };
  }

  if (req.user.role === "admin") {
    return {
      userId: rawUserId,
      statusCode: null,
      message: null,
    };
  }

  if (req.user.role !== "dietitian") {
    return {
      userId: null,
      statusCode: 403,
      message: "You cannot access analytics for this user",
    };
  }

  const assignedPatient = await User.findOne({
    _id: rawUserId,
    role: "client",
    dietitianId: req.user._id,
  });

  if (!assignedPatient) {
    return {
      userId: null,
      statusCode: 403,
      message: "Patient is not assigned to this dietitian",
    };
  }

  return {
    userId: rawUserId,
    statusCode: null,
    message: null,
  };
}

async function buildDailyNutritionSummary({ userId, dateStr }) {
  const date = dateStr ? new Date(dateStr) : new Date();
  date.setHours(0, 0, 0, 0);

  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  const meals = await Meal.find({
    userId,
    date: { $gte: date, $lt: nextDay },
  }).populate("mealProducts.productId");

  const totals = aggregateNutrition(meals);
  const user = await User.findById(userId);
  const goal = user?.dailyCalorieGoal || 0;

  return {
    date: date.toISOString().slice(0, 10),
    totals,
    goal,
    status:
      goal === 0
        ? "no goal set"
        : totals.calories > goal
          ? "exceeded"
          : totals.calories === goal
            ? "reached"
            : "below",
  };
}

async function buildPeriodAnalytics({ userId, period }) {
  const normalizedPeriod = period === "month" ? "month" : "week";
  const totalDays = normalizedPeriod === "month" ? 30 : 7;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (totalDays - 1));

  const meals = await Meal.find({
    userId,
    date: { $gte: start },
  }).populate("mealProducts.productId");

  const dayMap = new Map();

  for (let index = 0; index < totalDays; index++) {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    dayMap.set(day.toISOString().slice(0, 10), {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0,
    });
  }

  meals.forEach((meal) => {
    const key = meal.date.toISOString().slice(0, 10);
    if (!dayMap.has(key)) {
      dayMap.set(key, { calories: 0, proteins: 0, fats: 0, carbs: 0 });
    }

    const nutrition = aggregateNutrition([meal]);
    const entry = dayMap.get(key);

    entry.calories += nutrition.calories;
    entry.proteins += nutrition.proteins;
    entry.fats += nutrition.fats;
    entry.carbs += nutrition.carbs;
  });

  const days = Array.from(dayMap.entries())
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((left, right) => left.date.localeCompare(right.date));

  const averageCalories =
    days.reduce((sum, day) => sum + day.calories, 0) / (days.length || 1);
  const minCalories = Math.min(...days.map((day) => day.calories));
  const maxCalories = Math.max(...days.map((day) => day.calories));
  const criticalDay =
    days.length > 0
      ? days.reduce((maxDay, day) =>
          day.calories > maxDay.calories ? day : maxDay,
        )
      : null;

  return {
    period: normalizedPeriod,
    averageCalories,
    minCalories: Number.isFinite(minCalories) ? minCalories : 0,
    maxCalories: Number.isFinite(maxCalories) ? maxCalories : 0,
    criticalDay,
    days,
  };
}

async function buildActivitySummary({ userId, period }) {
  const normalizedPeriod =
    period === "month" ? "month" : period === "week" ? "week" : "day";
  const totalDays =
    normalizedPeriod === "month" ? 30 : normalizedPeriod === "week" ? 7 : 1;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (totalDays - 1));

  const measurements = await IoTMeasurement.find({
    userId,
    timestamp: { $gte: start },
  });

  const totalSteps = measurements.reduce(
    (sum, item) => sum + (item.steps || 0),
    0,
  );

  const burnedCalories = totalSteps * 0.04;
  const latestEntry = measurements.sort((a, b) => b.timestamp - a.timestamp)[0];

  return {
    period: normalizedPeriod,
    totalSteps,
    burnedCalories,
    lastWeight: latestEntry?.weight || null,
    lastMeasurementAt: latestEntry?.timestamp || null,
  };
}

//1. Денний підсумок (калорії + БЖВ)

export const getDailyNutritionSummary = async (req, res) => {
  try {
    const { userId, statusCode, message } = await resolveTargetUserId(
      req,
      req.query.userId,
    );

    if (!userId) {
      return res.status(statusCode).json({ message });
    }

    const result = await buildDailyNutritionSummary({
      userId,
      dateStr: req.query.date,
    });

    return res.json(result);
  } catch (error) {
    console.error("getDailyNutritionSummary error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//2. Аналітика за тиждень / місяць

export const getPeriodAnalytics = async (req, res) => {
  try {
    const { userId, statusCode, message } = await resolveTargetUserId(
      req,
      req.query.userId,
    );

    if (!userId) {
      return res.status(statusCode).json({ message });
    }

    const result = await buildPeriodAnalytics({
      userId,
      period: req.query.period || "week",
    });

    return res.json(result);
  } catch (error) {
    console.error("getPeriodAnalytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//3. IoT активність: кроки → калорії
export const getActivitySummary = async (req, res) => {
  try {
    const { userId, statusCode, message } = await resolveTargetUserId(
      req,
      req.query.userId,
    );

    if (!userId) {
      return res.status(statusCode).json({ message });
    }

    const result = await buildActivitySummary({
      userId,
      period: req.query.period || "day",
    });

    return res.json(result);
  } catch (error) {
    console.error("getActivitySummary error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getNutritionAndActivityOverview = async (req, res) => {
  try {
    const { userId, statusCode, message } = await resolveTargetUserId(
      req,
      req.query.userId,
    );

    if (!userId) {
      return res.status(statusCode).json({ message });
    }

    const [daily, weeklyNutrition, monthlyNutrition, activity] =
      await Promise.all([
        buildDailyNutritionSummary({ userId, dateStr: req.query.date }),
        buildPeriodAnalytics({ userId, period: "week" }),
        buildPeriodAnalytics({ userId, period: "month" }),
        buildActivitySummary({
          userId,
          period: req.query.activityPeriod || "week",
        }),
      ]);

    return res.json({
      userId,
      dailyNutrition: daily,
      weeklyNutrition,
      monthlyNutrition,
      activity,
    });
  } catch (error) {
    console.error("getNutritionAndActivityOverview error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//4. Генерація рекомендацій

export const generateAutoRecommendations = async (req, res) => {
  try {
    const { userId, statusCode, message } = await resolveTargetUserId(
      req,
      req.query.userId,
    );

    if (!userId) {
      return res.status(statusCode).json({ message });
    }

    const user = await User.findById(userId);
    const goal = user?.dailyCalorieGoal || 0;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const meals = await Meal.find({
      userId,
      date: { $gte: start },
    }).populate("mealProducts.productId");

    const byDay = new Map();

    meals.forEach((meal) => {
      const key = meal.date.toISOString().slice(0, 10);

      if (!byDay.has(key)) {
        byDay.set(key, { calories: 0, proteins: 0, fats: 0, carbs: 0 });
      }

      const nutrition = aggregateNutrition([meal]);
      const day = byDay.get(key);

      day.calories += nutrition.calories;
      day.proteins += nutrition.proteins;
      day.fats += nutrition.fats;
      day.carbs += nutrition.carbs;
    });

    const days = Array.from(byDay.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    const recommendations = [];

    if (goal > 0 && days.length >= 3) {
      const sorted = [...days].sort((left, right) =>
        left.date.localeCompare(right.date),
      );

      let streak = 0;

      sorted.forEach((day) => {
        if (day.calories > goal) {
          streak += 1;
          if (streak >= 3) {
            recommendations.push(
              "Ви протягом кількох днів перевищуєте денну норму калорій. Рекомендується зменшити порції, особливо ввечері.",
            );
          }
        } else {
          streak = 0;
        }
      });
    }

    if (goal > 0 && days.length > 0) {
      const idealProteinKcal = goal * 0.3;
      const idealProteinGrams = idealProteinKcal / 4;

      const avgProtein =
        days.reduce((sum, day) => sum + day.proteins, 0) / days.length;

      if (avgProtein < idealProteinGrams * 0.5) {
        recommendations.push(
          "Рівень споживання білків недостатній. Додайте до раціону більше білкових продуктів.",
        );
      }
    }

    const iot = await IoTMeasurement.find({
      userId,
      timestamp: { $gte: start },
    });

    const totalSteps = iot.reduce((sum, item) => sum + (item.steps || 0), 0);
    const avgSteps = iot.length > 0 ? totalSteps / iot.length : 0;

    if (avgSteps < 5000) {
      recommendations.push(
        "Рівень фізичної активності низький. Спробуйте додати більше руху та збільшити кількість кроків.",
      );
    }

    const created = await Promise.all(
      recommendations.map((text) =>
        Recommendation.create({
          userId,
          message: text,
          dietitianId: req.user.role === "dietitian" ? req.user._id : null,
        }),
      ),
    );

    return res.json({
      generated: created.length,
      recommendations: created,
    });
  } catch (error) {
    console.error("generateAutoRecommendations error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
