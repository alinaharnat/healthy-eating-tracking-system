import express from "express";
import {
  createProduct,
  updateProduct,
  getProduct,
  searchProducts,
  deleteProduct,
} from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Управління продуктами
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Створити новий продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *               calories:
 *                 type: number
 *                 example: 52
 *               proteins:
 *                 type: number
 *                 example: 0.3
 *               fats:
 *                 type: number
 *                 example: 0.2
 *               carbs:
 *                 type: number
 *                 example: 14
 *     responses:
 *       201:
 *         description: Продукт створено
 *       409:
 *         description: Продукт вже існує
 */
router.post("/", protect, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Оновити продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукту
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Продукт оновлено
 *       404:
 *         description: Продукт не знайдено
 */
router.put("/:id", protect, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Отримати продукт за ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукту
 *     responses:
 *       200:
 *         description: Дані продукту
 *       404:
 *         description: Продукт не знайдено
 */
router.get("/:id", protect, getProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Пошук продуктів
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Текст для пошуку
 *     responses:
 *       200:
 *         description: Список продуктів
 */
router.get("/", protect, searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Видалити продукт
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукту
 *     responses:
 *       200:
 *         description: Продукт видалено
 *       404:
 *         description: Продукт не знайдено
 */
router.delete("/:id", protect, deleteProduct);

export default router;
