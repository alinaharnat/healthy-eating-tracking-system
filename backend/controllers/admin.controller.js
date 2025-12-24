import User from "../models/user.js";
import Product from "../models/product.js";
import Meal from "../models/meal.js";
import IoTMeasurement from "../models/iotMeasurement.js";

//1. КЕРУВАННЯ КОРИСТУВАЧАМИ

/** Отримати всіх користувачів */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
};

/** Змінити роль користувача */
export const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    return res.status(404).json({ message: "Користувача не знайдено" });
  }

  res.json({
    message: "Роль оновлено",
    user,
  });
};

/** Заблокувати користувача (isActive = false) */
export const blockUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    return res.status(404).json({ message: "Користувача не знайдено" });
  }

  res.json({
    message: "Користувача заблоковано",
    user,
  });
};

/** Розблокувати користувача */
export const unblockUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    return res.status(404).json({ message: "Користувача не знайдено" });
  }

  res.json({
    message: "Користувача розблоковано",
    user,
  });
};

/** Отримати повну активність користувача */
export const getUserFullActivity = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-passwordHash");
  if (!user)
    return res.status(404).json({ message: "Користувача не знайдено" });

  const meals = await Meal.find({ userId }).populate("mealProducts.productId");
  const measurements = await IoTMeasurement.find({ userId });

  res.json({
    user,
    meals,
    measurements,
  });
};

//2. КЕРУВАННЯ ПРОДУКТАМИ

/** Оновити продукт (адмін) */
export const updateProductAdmin = async (req, res) => {
  const { productId } = req.params;

  const updated = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
  });

  if (!updated) {
    return res.status(404).json({ message: "Продукт не знайдено" });
  }

  res.json({
    message: "Продукт оновлено",
    product: updated,
  });
};

/** Видалити продукт */
export const deleteProductAdmin = async (req, res) => {
  const { productId } = req.params;

  const deleted = await Product.findByIdAndDelete(productId);
  if (!deleted) {
    return res.status(404).json({ message: "Продукт не знайдено" });
  }

  res.json({
    message: "Продукт видалено",
  });
};

//3. СТАТИСТИКА СИСТЕМИ

export const getSystemStatistics = async (req, res) => {
  const users = await User.find();
  const products = await Product.find();
  const meals = await Meal.find().populate("mealProducts.productId");

  /** 1. Кількість користувачів по ролях */
  const rolesCount = {
    client: users.filter((u) => u.role === "client").length,
    dietitian: users.filter((u) => u.role === "dietitian").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  /** 2. Найуживаніші продукти */
  const productUsage = {};

  meals.forEach((meal) => {
    meal.mealProducts.forEach((mp) => {
      const id = mp.productId?._id?.toString();
      if (id) productUsage[id] = (productUsage[id] || 0) + 1;
    });
  });

  const mostUsedProducts = Object.entries(productUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, usage]) => ({
      product: products.find((p) => p._id.toString() === id),
      usage,
    }));

  /** 3. Середня калорійність раціону по системі */
  let totalCalories = 0;
  let count = 0;

  meals.forEach((meal) => {
    meal.mealProducts.forEach((mp) => {
      if (!mp.productId) return;
      const cals = mp.productId.calories || 0;
      totalCalories += (cals * mp.weightGrams) / 100;
      count++;
    });
  });

  const averageCalories = count > 0 ? totalCalories / count : 0;

  res.json({
    usersCount: users.length,
    rolesCount,
    mostUsedProducts,
    averageCalories,
  });
};

//4. ЕКСПОРТ / ІМПОРТ БАЗИ ДАНИХ

export const exportDatabase = async (req, res) => {
  const users = await User.find();
  const products = await Product.find();
  const meals = await Meal.find();
  const measurements = await IoTMeasurement.find();

  res.json({
    users,
    products,
    meals,
    measurements,
  });
};

export const importDatabase = async (req, res) => {
  const { users, products, meals, measurements } = req.body;

  await User.deleteMany();
  await Product.deleteMany();
  await Meal.deleteMany();
  await IoTMeasurement.deleteMany();

  if (users) await User.insertMany(users);
  if (products) await Product.insertMany(products);
  if (meals) await Meal.insertMany(meals);
  if (measurements) await IoTMeasurement.insertMany(measurements);

  res.json({ message: "Імпорт завершено успішно" });
};
