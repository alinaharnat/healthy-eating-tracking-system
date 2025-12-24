import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

import {
  getAllUsers,
  changeUserRole,
  blockUser,
  unblockUser,
  getUserFullActivity,
  updateProductAdmin,
  deleteProductAdmin,
  getSystemStatistics,
  exportDatabase,
  importDatabase,
} from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Адміністрування системи (керування користувачами, продуктами, статистика, експорт/імпорт)
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Отримати всіх користувачів
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Доступно лише адміністратору. Повертає список усіх користувачів системи.
 *     responses:
 *       200:
 *         description: Список користувачів успішно отримано.
 */
router.get("/users", protect, authorize("admin"), getAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   patch:
 *     summary: Змінити роль користувача
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Дозволяє адміністратору змінити роль користувача (client, dietitian, admin).
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [client, dietitian, admin]
 *     responses:
 *       200:
 *         description: Роль користувача змінено.
 */
router.patch(
  "/users/:userId/role",
  protect,
  authorize("admin"),
  changeUserRole
);

/**
 * @swagger
 * /api/admin/users/{userId}/block:
 *   patch:
 *     summary: Заблокувати користувача
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Переводить користувача у статус isActive = false.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Користувача заблоковано.
 */
router.patch("/users/:userId/block", protect, authorize("admin"), blockUser);

/**
 * @swagger
 * /api/admin/users/{userId}/unblock:
 *   patch:
 *     summary: Розблокувати користувача
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Переводить користувача у статус isActive = true.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Користувача розблоковано.
 */
router.patch(
  "/users/:userId/unblock",
  protect,
  authorize("admin"),
  unblockUser
);

/**
 * @swagger
 * /api/admin/users/{userId}/activity:
 *   get:
 *     summary: Отримати повну активність користувача
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Повертає детальну інформацію про користувача: профіль, його прийоми їжі, IoT вимірювання.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані активності користувача отримано.
 */
router.get(
  "/users/:userId/activity",
  protect,
  authorize("admin"),
  getUserFullActivity
);

/**
 * @swagger
 * /api/admin/products/{productId}:
 *   patch:
 *     summary: Оновити дані продукту
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Дозволяє адміністратору оновлювати харчові параметри продуктів.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Продукт оновлено.
 */
router.patch(
  "/products/:productId",
  protect,
  authorize("admin"),
  updateProductAdmin
);

/**
 * @swagger
 * /api/admin/products/{productId}:
 *   delete:
 *     summary: Видалити продукт
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Дозволяє адміністратору видалити продукт із системи.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Продукт видалено.
 */
router.delete(
  "/products/:productId",
  protect,
  authorize("admin"),
  deleteProductAdmin
);

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Отримати статистику системи
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Повертає ключові статистичні показники системи:
 *       • кількість користувачів по ролях
 *       • найуживаніші продукти
 *       • середня калорійність раціону
 *     responses:
 *       200:
 *         description: Статистика успішно отримана.
 */
router.get("/statistics", protect, authorize("admin"), getSystemStatistics);

/**
 * @swagger
 * /api/admin/export:
 *   get:
 *     summary: Експортувати всю базу даних у JSON
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Експортує користувачів, продукти, прийоми їжі та IoT-вимірювання.
 *     responses:
 *       200:
 *         description: Експорт виконано успішно.
 */
router.get("/export", protect, authorize("admin"), exportDatabase);

/**
 * @swagger
 * /api/admin/import:
 *   post:
 *     summary: Імпортувати базу даних у систему
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Повністю очищує систему та імпортує нові дані.
 *       Використовувати тільки у випадку відновлення або перенесення проєкту.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *               products:
 *                 type: array
 *               meals:
 *                 type: array
 *               measurements:
 *                 type: array
 *     responses:
 *       200:
 *         description: Імпорт завершено.
 */
router.post("/import", protect, authorize("admin"), importDatabase);

export default router;
