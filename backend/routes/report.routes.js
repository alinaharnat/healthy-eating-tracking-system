import express from "express";
import {
  createReport,
  getMyReports,
  deleteReport,
} from "../controllers/report.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Завантажені звіти користувача
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Додати звіт
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileUrl
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 example: https://storage.example.com/report1.pdf
 *     responses:
 *       201:
 *         description: Звіт створено
 */
router.post("/", protect, createReport);

/**
 * @swagger
 * /api/reports/my:
 *   get:
 *     summary: Отримати мої звіти
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список звітів користувача
 */
router.get("/my", protect, getMyReports);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Видалити звіт
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Звіт видалено
 */
router.delete("/:id", protect, deleteReport);

export default router;
