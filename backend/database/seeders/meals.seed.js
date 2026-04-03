import Meal from "../../models/meal.js";
import { seedDate } from "./helpers/randomDate.js";

const MEAL_SEED_DATA = [
  {
    userKey: "client_andrii",
    daysAgo: 2,
    hour: 8,
    minute: 15,
    mealType: "breakfast",
    products: [
      { productKey: "oats", weightGrams: 70 },
      { productKey: "banana", weightGrams: 120 },
      { productKey: "almonds", weightGrams: 15 },
    ],
  },
  {
    userKey: "client_andrii",
    daysAgo: 2,
    hour: 13,
    minute: 10,
    mealType: "lunch",
    products: [
      { productKey: "chicken_breast", weightGrams: 180 },
      { productKey: "brown_rice", weightGrams: 160 },
      { productKey: "broccoli", weightGrams: 140 },
    ],
  },
  {
    userKey: "client_andrii",
    daysAgo: 2,
    hour: 19,
    minute: 30,
    mealType: "dinner",
    products: [
      { productKey: "salmon", weightGrams: 150 },
      { productKey: "avocado", weightGrams: 80 },
      { productKey: "broccoli", weightGrams: 120 },
    ],
  },
  {
    userKey: "client_maria",
    daysAgo: 1,
    hour: 7,
    minute: 50,
    mealType: "breakfast",
    products: [
      { productKey: "wholegrain_bread", weightGrams: 80 },
      { productKey: "egg", weightGrams: 100 },
      { productKey: "apple", weightGrams: 140 },
    ],
  },
  {
    userKey: "client_maria",
    daysAgo: 1,
    hour: 12,
    minute: 45,
    mealType: "lunch",
    products: [
      { productKey: "buckwheat", weightGrams: 170 },
      { productKey: "chicken_breast", weightGrams: 140 },
      { productKey: "olive_oil", weightGrams: 8 },
    ],
  },
  {
    userKey: "client_maria",
    daysAgo: 1,
    hour: 17,
    minute: 40,
    mealType: "snack",
    products: [
      { productKey: "greek_yogurt", weightGrams: 220 },
      { productKey: "banana", weightGrams: 100 },
    ],
  },
  {
    userKey: "client_oleksii",
    daysAgo: 3,
    hour: 8,
    minute: 10,
    mealType: "breakfast",
    products: [
      { productKey: "oats", weightGrams: 90 },
      { productKey: "cottage_cheese", weightGrams: 130 },
      { productKey: "banana", weightGrams: 130 },
    ],
  },
  {
    userKey: "client_oleksii",
    daysAgo: 3,
    hour: 13,
    minute: 0,
    mealType: "lunch",
    products: [
      { productKey: "chicken_breast", weightGrams: 220 },
      { productKey: "brown_rice", weightGrams: 220 },
      { productKey: "broccoli", weightGrams: 130 },
    ],
  },
  {
    userKey: "client_oleksii",
    daysAgo: 3,
    hour: 19,
    minute: 20,
    mealType: "dinner",
    products: [
      { productKey: "salmon", weightGrams: 180 },
      { productKey: "buckwheat", weightGrams: 180 },
    ],
  },
  {
    userKey: "client_sophia",
    daysAgo: 1,
    hour: 8,
    minute: 20,
    mealType: "breakfast",
    products: [
      { productKey: "greek_yogurt", weightGrams: 180 },
      { productKey: "apple", weightGrams: 180 },
      { productKey: "almonds", weightGrams: 12 },
    ],
  },
  {
    userKey: "client_sophia",
    daysAgo: 1,
    hour: 12,
    minute: 55,
    mealType: "lunch",
    products: [
      { productKey: "salmon", weightGrams: 140 },
      { productKey: "broccoli", weightGrams: 150 },
      { productKey: "olive_oil", weightGrams: 7 },
    ],
  },
  {
    userKey: "client_taras",
    daysAgo: 0,
    hour: 7,
    minute: 45,
    mealType: "breakfast",
    products: [
      { productKey: "wholegrain_bread", weightGrams: 90 },
      { productKey: "egg", weightGrams: 120 },
      { productKey: "avocado", weightGrams: 70 },
    ],
  },
  {
    userKey: "client_taras",
    daysAgo: 0,
    hour: 13,
    minute: 5,
    mealType: "lunch",
    products: [
      { productKey: "chicken_breast", weightGrams: 170 },
      { productKey: "buckwheat", weightGrams: 190 },
      { productKey: "broccoli", weightGrams: 110 },
    ],
  },
  {
    userKey: "client_taras",
    daysAgo: 0,
    hour: 19,
    minute: 10,
    mealType: "dinner",
    products: [
      { productKey: "salmon", weightGrams: 160 },
      { productKey: "brown_rice", weightGrams: 180 },
      { productKey: "broccoli", weightGrams: 140 },
    ],
  },
];

function getRequired(map, key, label) {
  const value = map[key];

  if (!value) {
    throw new Error(`Missing required ${label}: ${key}`);
  }

  return value;
}

export async function seedMeals({ usersByKey, productsByKey }) {
  const documents = MEAL_SEED_DATA.map((meal) => {
    const user = getRequired(usersByKey, meal.userKey, "user");

    const mealProducts = meal.products.map((item) => {
      const product = getRequired(productsByKey, item.productKey, "product");
      return {
        productId: product._id,
        weightGrams: item.weightGrams,
      };
    });

    return {
      userId: user._id,
      date: seedDate({
        daysAgo: meal.daysAgo,
        hour: meal.hour,
        minute: meal.minute,
      }),
      mealType: meal.mealType,
      mealProducts,
    };
  });

  const meals = await Meal.insertMany(documents, { ordered: true });

  return {
    mealsCount: meals.length,
  };
}
