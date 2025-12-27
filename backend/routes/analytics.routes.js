import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  getDailyNutritionSummary,
  getPeriodAnalytics,
  getActivitySummary,
  generateAutoRecommendations,
} from "../controllers/businessLogic.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Бізнес-логіка — підрахунок калорій, БЖВ, аналітика та IoT
 */

/**
 * @swagger
 * /api/analytics/daily:
 *   get:
 *     summary: Отримати денний підсумок калорій та БЖВ
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Повертає сумарну кількість калорій, білків, жирів та вуглеводів за обрану дату.
 *       Якщо дату не вказано, використовується поточна дата.
 *
 *       Формула:
 *       калорії = product.calories × weightGrams / 100
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Дата у форматі YYYY-MM-DD (за замовчуванням — сьогодні)
 *     responses:
 *       200:
 *         description: Успішне отримання денного підсумку
 */
router.get("/daily", protect, getDailyNutritionSummary);

/**
 * @swagger
 * /api/analytics/period:
 *   get:
 *     summary: Отримати статистику за тиждень або місяць
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Аналізує харчування користувача за 7 або 30 днів.
 *
 *       Повертає:
 *         • середнє денне споживання калорій
 *         • мінімальні та максимальні значення
 *         • «критичний день» — день із найбільшим переїданням
 *
 *       Дані групуються за датами та аналізуються поміж прийомів їжі.
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month]
 *         required: false
 *         description: Період аналізу (week = 7 днів, month = 30 днів). За замовчуванням — week.
 *     responses:
 *       200:
 *         description: Аналітика за вказаний період
 */
router.get("/period", protect, getPeriodAnalytics);

/**
 * @swagger
 * /api/analytics/activity:
 *   get:
 *     summary: Отримати IoT-активність користувача
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Повертає зведення активності за IoT-вимірюваннями:
 *
 *       • сумарна кількість кроків
 *       • витрачені калорії (формула = steps × 0.04)
 *       • остання зафіксована вага
 *
 *       Доступні два режими:
 *       - day — дані за сьогодні
 *       - week — дані за останні 7 днів
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week]
 *         required: false
 *         description: Період аналізу. За замовчуванням — day.
 *     responses:
 *       200:
 *         description: Зведення фізичної активності користувача
 */
router.get("/activity", protect, getActivitySummary);

/**
 * @swagger
 * /api/analytics/recommendations/auto:
 *   post:
 *     summary: Згенерувати автоматичні рекомендації
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Генерує рекомендації на основі поведінки користувача:
 *
 *       1. Перевищення калорій 3 дні поспіль — порада зменшити порції
 *       2. Низький рівень білків — рекомендація додати білкові продукти
 *       3. Низька фізична активність (кроки < 5000) — порада більше рухатись
 *
 *       Усі рекомендації зберігаються у колекції Recommendation.
 *     responses:
 *       200:
 *         description: Рекомендації успішно сформовано
 */
router.post("/recommendations/auto", protect, generateAutoRecommendations);

export default router;
