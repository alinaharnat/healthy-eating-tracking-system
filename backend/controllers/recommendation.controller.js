import Recommendation from "../models/recommendation.js";
import User from "../models/user.js";
import mongoose from "mongoose";

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

async function isAccessiblePatient({ patientId, actor }) {
  if (!isValidObjectId(patientId)) {
    return false;
  }

  if (actor.role === "admin") {
    const patient = await User.findOne({ _id: patientId, role: "client" });
    return Boolean(patient);
  }

  if (actor.role !== "dietitian") {
    return String(patientId) === String(actor._id);
  }

  const patient = await User.findOne({
    _id: patientId,
    role: "client",
    dietitianId: actor._id,
  });

  return Boolean(patient);
}

function canMutateRecommendation(recommendation, actor) {
  if (actor.role === "admin") {
    return true;
  }

  if (actor.role === "dietitian") {
    return String(recommendation.dietitianId) === String(actor._id);
  }

  if (actor.role === "client") {
    return String(recommendation.userId) === String(actor._id);
  }

  return false;
}

export const createRecommendation = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "userId & message required" });
    }

    const canCreateForPatient = await isAccessiblePatient({
      patientId: userId,
      actor: req.user,
    });

    if (!canCreateForPatient) {
      return res
        .status(403)
        .json({ message: "You cannot create a recommendation for this user" });
    }

    const rec = await Recommendation.create({
      userId,
      dietitianId: req.user._id,
      message,
    });

    return res.status(201).json(rec);
  } catch (error) {
    console.error("createRecommendation error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const listMyRecommendations = async (req, res) => {
  try {
    const { userId } = req.query;
    const criteria = {};

    if (req.user.role === "dietitian") {
      criteria.dietitianId = req.user._id;

      if (userId) {
        const canAccess = await isAccessiblePatient({
          patientId: userId,
          actor: req.user,
        });

        if (!canAccess) {
          return res.status(403).json({ message: "Patient is not assigned" });
        }

        criteria.userId = userId;
      }
    } else if (req.user.role === "client") {
      criteria.userId = req.user._id;
    } else if (req.user.role === "admin") {
      if (userId) {
        criteria.userId = userId;
      }
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const items = await Recommendation.find(criteria)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    console.error("listMyRecommendations error:", error);

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid recommendation id" });
    }

    if (!String(message || "").trim()) {
      return res.status(400).json({ message: "message is required" });
    }

    const recommendation = await Recommendation.findById(id);

    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    if (!canMutateRecommendation(recommendation, req.user)) {
      return res
        .status(403)
        .json({ message: "You cannot update this recommendation" });
    }

    recommendation.message = String(message).trim();
    await recommendation.save();

    return res.json(recommendation);
  } catch (error) {
    console.error("updateRecommendation error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid recommendation id" });
    }

    const recommendation = await Recommendation.findById(id);

    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    if (!canMutateRecommendation(recommendation, req.user)) {
      return res
        .status(403)
        .json({ message: "You cannot delete this recommendation" });
    }

    await Recommendation.findByIdAndDelete(id);

    return res.json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    console.error("deleteRecommendation error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
