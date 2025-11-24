import Report from "../models/report.js";

// Створити звіт
export const createReport = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "fileUrl is required" });
    }

    const report = await Report.create({
      userId: req.user._id,
      fileUrl,
    });

    return res.status(201).json(report);
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Отримати мої звіти
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(reports);
  } catch (error) {
    console.error("getMyReports error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Видалити звіт
export const deleteReport = async (req, res) => {
  try {
    const deleted = await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("deleteReport error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
