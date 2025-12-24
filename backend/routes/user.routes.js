import express from "express";
import {
  getMe,
  updateMe,
  listPatients,
} from "../controllers/user.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управління користувачами
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Отримати мій профіль
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Дані користувача
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Оновити мій профіль
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Alina"
 *               language:
 *                 type: string
 *                 enum: ["ua", "en"]
 *                 example: "ua"
 *               age:
 *                 type: number
 *                 example: 21
 *               height:
 *                 type: number
 *                 example: 165
 *               weight:
 *                 type: number
 *                 example: 55
 *               goalType:
 *                 type: string
 *                 enum: ["lose", "maintain", "gain"]
 *                 example: "lose"
 *               dailyCalorieGoal:
 *                 type: number
 *                 example: 1800
 *     responses:
 *       200:
 *         description: Профіль оновлено
 */
router.patch("/me", protect, updateMe);

/**
 * @swagger
 * /api/users/patients:
 *   get:
 *     summary: Список пацієнтів дієтолога
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пацієнтів
 */
router.get("/patients", protect, authorize("dietitian"), listPatients);

export default router;
