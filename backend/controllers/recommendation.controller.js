import Recommendation from "../models/recommendation.js";

export const createRecommendation = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "userId & message required" });
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
    const items = await Recommendation.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    console.error("listMyRecommendations error:", error);

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteRecommendation = async (req, res) => {
  try {
    const deleted = await Recommendation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    return res.json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    console.error("deleteRecommendation error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
