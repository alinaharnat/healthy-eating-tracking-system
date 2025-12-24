import Meal from "../models/meal.js";
import Product from "../models/product.js";
import IoTMeasurement from "../models/iotMeasurement.js";
import Recommendation from "../models/recommendation.js";
import User from "../models/user.js";

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

//1. Денний підсумок (калорії + БЖВ)

export const getDailyNutritionSummary = async (req, res) => {
  const userId = req.user._id;
  const dateStr = req.query.date;

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
  const goal = user.dailyCalorieGoal || 0;

  return res.json({
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
  });
};

//2. Аналітика за тиждень / місяць

export const getPeriodAnalytics = async (req, res) => {
  const userId = req.user._id;
  const period = req.query.period || "week"; // week | month
  const days = period === "month" ? 30 : 7;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const meals = await Meal.find({
    userId,
    date: { $gte: start },
  }).populate("mealProducts.productId");

  const dayMap = new Map();

  meals.forEach((meal) => {
    const key = meal.date.toISOString().slice(0, 10);
    if (!dayMap.has(key))
      dayMap.set(key, { calories: 0, proteins: 0, fats: 0, carbs: 0 });

    const t = aggregateNutrition([meal]);
    const d = dayMap.get(key);

    d.calories += t.calories;
    d.proteins += t.proteins;
    d.fats += t.fats;
    d.carbs += t.carbs;
  });

  const result = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));

  if (result.length === 0)
    return res.json({
      period,
      averageCalories: 0,
      minCalories: 0,
      maxCalories: 0,
      criticalDay: null,
      days: [],
    });

  const avg = result.reduce((acc, d) => acc + d.calories, 0) / result.length;

  const min = Math.min(...result.map((d) => d.calories));
  const max = Math.max(...result.map((d) => d.calories));

  const criticalDay = result.reduce((maxDay, d) =>
    d.calories > maxDay.calories ? d : maxDay
  );

  return res.json({
    period,
    averageCalories: avg,
    minCalories: min,
    maxCalories: max,
    criticalDay,
    days: result,
  });
};

//3. IoT активність: кроки → калорії
export const getActivitySummary = async (req, res) => {
  const userId = req.user._id;
  const period = req.query.period || "day"; // day | week
  const days = period === "week" ? 7 : 1;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const iot = await IoTMeasurement.find({
    userId,
    timestamp: { $gte: start },
  });

  const totalSteps = iot.reduce((acc, m) => acc + (m.steps || 0), 0);
  const burnedCalories = totalSteps * 0.04;

  const lastWeightEntry = iot.sort((a, b) => b.timestamp - a.timestamp)[0];

  return res.json({
    period,
    totalSteps,
    burnedCalories,
    lastWeight: lastWeightEntry?.weight || null,
  });
};

//4. Генерація рекомендацій

export const generateAutoRecommendations = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  const goal = user.dailyCalorieGoal || 0;

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
    if (!byDay.has(key))
      byDay.set(key, { calories: 0, proteins: 0, fats: 0, carbs: 0 });

    const t = aggregateNutrition([meal]);
    const d = byDay.get(key);

    d.calories += t.calories;
    d.proteins += t.proteins;
    d.fats += t.fats;
    d.carbs += t.carbs;
  });

  const days = Array.from(byDay.entries()).map(([date, d]) => ({
    date,
    ...d,
  }));

  const recs = [];

  // 1) 3 дні поспіль понад норму
  if (goal > 0 && days.length >= 3) {
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    let streak = 0;

    sorted.forEach((d) => {
      if (d.calories > goal) {
        streak++;
        if (streak >= 3) {
          recs.push(
            "Ви протягом кількох днів перевищуєте денну норму калорій. Рекомендується зменшити порції, особливо ввечері."
          );
        }
      } else {
        streak = 0;
      }
    });
  }

  // 2) білки < 50% від норми
  if (goal > 0 && days.length > 0) {
    const idealProteinKcal = goal * 0.3;
    const idealProteinGrams = idealProteinKcal / 4;

    const avgProtein =
      days.reduce((sum, d) => sum + d.proteins, 0) / days.length;

    if (avgProtein < idealProteinGrams * 0.5) {
      recs.push(
        "Рівень споживання білків недостатній. Додайте до раціону більше білкових продуктів."
      );
    }
  }

  // 3) низька активність за IoT
  const iot = await IoTMeasurement.find({
    userId,
    timestamp: { $gte: start },
  });

  const totalSteps = iot.reduce((s, m) => s + (m.steps || 0), 0);
  const avgSteps = iot.length > 0 ? totalSteps / iot.length : 0;

  if (avgSteps < 5000) {
    recs.push(
      "Рівень фізичної активності низький. Спробуйте додати більше руху та збільшити кількість кроків."
    );
  }

  const created = await Promise.all(
    recs.map((msg) =>
      Recommendation.create({
        userId,
        message: msg,
      })
    )
  );

  return res.json({
    generated: created.length,
    recommendations: created,
  });
};
