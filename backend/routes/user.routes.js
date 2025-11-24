import express from "express";
import {
  getMe,
  updateMe,
  listPatients,
  listUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminStatistics,
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
 */
router.get("/patients", protect, authorize("dietitian"), listPatients);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Отримати всіх користувачів
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", protect, authorize("admin"), listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Оновити користувача (адмін)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", protect, authorize("admin"), adminUpdateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Видалити користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", protect, authorize("admin"), adminDeleteUser);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Статистика користувачів
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get("/stats", protect, authorize("admin"), adminStatistics);

export default router;
