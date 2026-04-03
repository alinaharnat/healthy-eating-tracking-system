import Product from "../../models/product.js";
import { normalizeProductName } from "./helpers/normalizeProductName.js";

const PRODUCT_SEED_DATA = [
  {
    key: "oats",
    name: "Oats",
    calories: 379,
    proteins: 13.2,
    fats: 6.5,
    carbs: 67.7,
  },
  {
    key: "banana",
    name: "Banana",
    calories: 89,
    proteins: 1.1,
    fats: 0.3,
    carbs: 22.8,
  },
  {
    key: "egg",
    name: "Chicken Egg",
    calories: 155,
    proteins: 13,
    fats: 11,
    carbs: 1.1,
  },
  {
    key: "chicken_breast",
    name: "Chicken Breast",
    calories: 165,
    proteins: 31,
    fats: 3.6,
    carbs: 0,
  },
  {
    key: "brown_rice",
    name: "Brown Rice",
    calories: 123,
    proteins: 2.7,
    fats: 1,
    carbs: 25.6,
  },
  {
    key: "olive_oil",
    name: "Olive Oil",
    calories: 884,
    proteins: 0,
    fats: 100,
    carbs: 0,
  },
  {
    key: "greek_yogurt",
    name: "Greek Yogurt",
    calories: 59,
    proteins: 10.3,
    fats: 0.4,
    carbs: 3.6,
  },
  {
    key: "almonds",
    name: "Almonds",
    calories: 579,
    proteins: 21.2,
    fats: 49.9,
    carbs: 21.6,
  },
  {
    key: "salmon",
    name: "Salmon Fillet",
    calories: 208,
    proteins: 20.4,
    fats: 13.4,
    carbs: 0,
  },
  {
    key: "broccoli",
    name: "Broccoli",
    calories: 34,
    proteins: 2.8,
    fats: 0.4,
    carbs: 6.6,
  },
  {
    key: "cottage_cheese",
    name: "Cottage Cheese",
    calories: 98,
    proteins: 11.1,
    fats: 4.3,
    carbs: 3.4,
  },
  {
    key: "wholegrain_bread",
    name: "Wholegrain Bread",
    calories: 247,
    proteins: 12.5,
    fats: 3.4,
    carbs: 41.2,
  },
  {
    key: "avocado",
    name: "Avocado",
    calories: 160,
    proteins: 2,
    fats: 14.7,
    carbs: 8.5,
  },
  {
    key: "apple",
    name: "Apple",
    calories: 52,
    proteins: 0.3,
    fats: 0.2,
    carbs: 13.8,
  },
  {
    key: "buckwheat",
    name: "Buckwheat",
    calories: 343,
    proteins: 13.3,
    fats: 3.4,
    carbs: 71.5,
  },
];

export async function seedProducts() {
  const documents = PRODUCT_SEED_DATA.map((item) => ({
    name: item.name,
    normalizedName: normalizeProductName(item.name),
    calories: item.calories,
    proteins: item.proteins,
    fats: item.fats,
    carbs: item.carbs,
  }));

  const createdProducts = await Product.insertMany(documents, {
    ordered: true,
  });

  const productsByKey = {};

  PRODUCT_SEED_DATA.forEach((item, index) => {
    productsByKey[item.key] = createdProducts[index];
  });

  return {
    productsByKey,
    productsCount: createdProducts.length,
  };
}
