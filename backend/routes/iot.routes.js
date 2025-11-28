import express from "express";
import {
  createMeasurement,
  latestMeasurements,
  deleteMeasurement,
} from "../controllers/iot.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: IoT Measurements
 *   description: Дані з IoT пристроїв
 */

/**
 * @swagger
 * /api/iot-measurements:
 *   post:
 *     summary: Додати нове IoT-вимірювання
 *     tags: [IoT Measurements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pulse
 *               - steps
 *             properties:
 *               pulse:
 *                 type: number
 *               steps:
 *                 type: number
 *               weight:
 *                 type: number
 *     responses:
 *       201:
 *         description: Вимірювання успішно збережено
 */
router.post("/", protect, createMeasurement);

/**
 * @swagger
 * /api/iot-measurements/latest:
 *   get:
 *     summary: Отримати останні 10 вимірювань
 *     tags: [IoT Measurements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список останніх вимірювань
 */
router.get("/latest", protect, latestMeasurements);

/**
 * @swagger
 * /api/iot-measurements/{id}:
 *   delete:
 *     summary: Видалити IoT-вимірювання
 *     tags: [IoT Measurements]
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
 *         description: Вимірювання видалено
 *       404:
 *         description: Вимірювання не знайдено
 */
router.delete("/:id", protect, deleteMeasurement);

export default router;
