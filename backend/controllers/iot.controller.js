import IoTMeasurement from "../models/IoTMeasurement.js";

export const createMeasurement = async (req, res) => {
  try {
    const { pulse, steps, weight } = req.body;

    if (pulse === undefined || steps === undefined) {
      return res.status(400).json({ message: "pulse and steps are required" });
    }

    const measurement = await IoTMeasurement.create({
      userId: req.user._id,
      pulse,
      steps,
      weight: weight ?? null,
    });

    return res.status(201).json(measurement);
  } catch (error) {
    console.error("createMeasurement error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const latestMeasurements = async (req, res) => {
  try {
    const items = await IoTMeasurement.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json(items);
  } catch (error) {
    console.error("latestMeasurements error:", error);

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteMeasurement = async (req, res) => {
  try {
    const deleted = await IoTMeasurement.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    return res.json({ message: "Measurement deleted successfully" });
  } catch (error) {
    console.error("deleteMeasurement error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
