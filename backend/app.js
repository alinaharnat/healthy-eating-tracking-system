import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import mealRoutes from "./routes/meal.routes.js";
import productRoutes from "./routes/product.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import iotRoutes from "./routes/iot.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const legacyMatch = req.path.match(/^\/(get|post|put|patch|delete)\/(.+)/i);

  if (legacyMatch && legacyMatch[1].toUpperCase() === req.method) {
    req.url = `/api/${legacyMatch[2]}${req.url.slice(req.path.length)}`;
  }

  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/iot-measurements", iotRoutes);
app.use("/api/reports", reportRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Macri API is running 🚀",
    version: "1.0.0",
    docs: "/api-docs",
  });
});

// ================== 404 HANDLER ==================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Маршрут не знайдено",
  });
});

// ================== GLOBAL ERROR HANDLER ==================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Внутрішня помилка сервера",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
