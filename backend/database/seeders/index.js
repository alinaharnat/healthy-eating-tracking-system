import User from "../../models/user.js";
import Product from "../../models/product.js";
import Meal from "../../models/meal.js";
import IoTMeasurement from "../../models/iotMeasurement.js";
import Recommendation from "../../models/recommendation.js";
import Report from "../../models/report.js";

import { seedUsers } from "./users.seed.js";
import { seedProducts } from "./products.seed.js";
import { seedMeals } from "./meals.seed.js";
import { seedIoTMeasurements } from "./iotMeasurements.seed.js";
import { seedRecommendations } from "./recommendations.seed.js";
import { seedReports } from "./reports.seed.js";

const RESET_ORDER = [
  Recommendation,
  Report,
  IoTMeasurement,
  Meal,
  Product,
  User,
];

async function clearCollections() {
  for (const Model of RESET_ORDER) {
    await Model.deleteMany({});
  }
}

export async function runSeeds({ reset = true } = {}) {
  // Strategy: destructive reseed for development.
  // Why: this guarantees deterministic data and avoids stale relationship drift
  // across reruns in an academic/dev environment.
  if (reset) {
    await clearCollections();
  }

  const userResult = await seedUsers();
  const productResult = await seedProducts();

  const mealResult = await seedMeals({
    usersByKey: userResult.usersByKey,
    productsByKey: productResult.productsByKey,
  });

  const measurementResult = await seedIoTMeasurements({
    usersByKey: userResult.usersByKey,
  });

  const recommendationResult = await seedRecommendations({
    usersByKey: userResult.usersByKey,
  });

  const reportResult = await seedReports({
    usersByKey: userResult.usersByKey,
  });

  return {
    users: userResult.usersCount,
    products: productResult.productsCount,
    meals: mealResult.mealsCount,
    iotMeasurements: measurementResult.measurementsCount,
    recommendations: recommendationResult.recommendationsCount,
    reports: reportResult.reportsCount,
    devPassword: userResult.devPassword,
  };
}
