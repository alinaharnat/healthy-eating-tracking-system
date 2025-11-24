import express from "express";
import {
  createRecommendation,
  listMyRecommendations,
  deleteRecommendation,
} from "../controllers/recommendation.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Рекомендації від дієтолога
 */

/**
 * @swagger
 * /api/recommendations:
 *   post:
 *     summary: Створити рекомендацію для користувача
 *     tags: [Recommendations]
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
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64fcd93a8d12bdc31a9f23ab
 *               message:
 *                 type: string
 *                 example: Збільшити споживання білка до 100г на день
 *     responses:
 *       201:
 *         description: Рекомендацію створено
 *       400:
 *         description: Помилка вхідних даних
 */
router.post(
  "/",
  protect,
  authorize("dietitian", "admin"),
  createRecommendation
);

/**
 * @swagger
 * /api/recommendations/my:
 *   get:
 *     summary: Отримати мої рекомендації
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список рекомендацій поточного користувача
 */
router.get("/my", protect, listMyRecommendations);

/**
 * @swagger
 * /api/recommendations/{id}:
 *   delete:
 *     summary: Видалити рекомендацію
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID рекомендації
 *     responses:
 *       200:
 *         description: Рекомендацію видалено
 *       404:
 *         description: Рекомендація не знайдена
 */
router.delete(
  "/:id",
  protect,
  authorize("dietitian", "admin"),
  deleteRecommendation
);

export default router;
