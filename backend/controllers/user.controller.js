import User from "../models/user.js";

/** GET /api/users/me */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/users/me */
export const updateMe = async (req, res) => {
  try {
    const allowed = [
      "name",
      "language",
      "age",
      "height",
      "weight",
      "goalType",
      "dailyCalorieGoal",
      "dietitianId",
    ];

    const data = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    });

    const updated = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    console.error("updateMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/users/patients (dietitian only) */
export const listPatients = async (req, res) => {
  try {
    const patients = await User.find(
      { dietitianId: req.user._id },
      "name email role goalType"
    );

    return res.json(patients);
  } catch (error) {
    console.error("listPatients error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
