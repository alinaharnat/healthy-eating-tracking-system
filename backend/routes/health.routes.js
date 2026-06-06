import express from "express";
import os from "os";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    hostname: os.hostname(),
  });
});

export default router;
