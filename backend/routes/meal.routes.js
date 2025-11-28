import express from "express";
import {
  createMeal,
  addProductToMeal,
  removeProductFromMeal,
  getMealsByDate,
  getMealsHistory,
  updateMeal,
  deleteMeal,
} from "../controllers/meal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Управління прийомами їжі
 */

/**
 * @swagger
 * /api/meals:
 *   post:
 *     summary: Створити прийом їжі
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - date
 *               - mealType
 *               - mealProducts
 *             properties:
 *               userId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               mealType:
 *                 type: string
 *               mealProducts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     weightGrams:
 *                       type: number
 *     responses:
 *       201:
 *         description: Прийом їжі створений
 */
router.post("/", protect, createMeal);

/**
 * @swagger
 * /api/meals/{id}/add-product:
 *   post:
 *     summary: Додати продукт до прийому їжі
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - weightGrams
 *             properties:
 *               productId:
 *                 type: string
 *               weightGrams:
 *                 type: number
 *     responses:
 *       200:
 *         description: Продукт додано
 */
router.post("/:id/add-product", protect, addProductToMeal);

/**
 * @swagger
 * /api/meals/{id}/remove-product:
 *   delete:
 *     summary: Видалити продукт з прийому їжі
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Продукт видалено
 */
router.delete("/:id/remove-product", protect, removeProductFromMeal);

/**
 * @swagger
 * /api/meals/by-date:
 *   get:
 *     summary: Отримати прийоми їжі за датою
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список прийомів їжі
 */
router.get("/by-date", protect, getMealsByDate);

/**
 * @swagger
 * /api/meals/history:
 *   get:
 *     summary: Історія прийомів їжі
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: period
 *         in: query
 *         schema:
 *           type: string
 *           enum: [week, month]
 *     responses:
 *       200:
 *         description: Історія прийомів
 */
router.get("/history", protect, getMealsHistory);

/**
 * @swagger
 * /api/meals/{id}:
 *   put:
 *     summary: Оновити прийом їжі
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Прийом їжі оновлено
 */
router.put("/:id", protect, updateMeal);

/**
 * @swagger
 * /api/meals/{id}:
 *   delete:
 *     summary: Видалити прийом їжі
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Прийом їжі видалено
 */
router.delete("/:id", protect, deleteMeal);

export default router;
