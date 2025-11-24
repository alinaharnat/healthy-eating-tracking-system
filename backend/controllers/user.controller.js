import User from "../models/User.js";

// ===================== ПРОФІЛЬ ПОТОЧНОГО КОРИСТУВАЧА =====================

// GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/me
export const updateMe = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "language",
      "age",
      "height",
      "weight",
      "goalType",
      "dailyCalorieGoal",
      "dietitianId",
    ];

    const patch = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) patch[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, patch, {
      new: true,
      runValidators: true,
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("updateMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== ДЛЯ ДІЄТОЛОГА =====================

// GET /api/users/patients
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

// ===================== ДЛЯ АДМІНА =====================

// GET /api/users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    return res.json(users);
  } catch (error) {
    console.error("listUsers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/:id
export const adminUpdateUser = async (req, res) => {
  try {
    const allowedFields = ["role", "dietitianId"];
    const patch = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) patch[field] = req.body[field];
    });

    const updated = await User.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated", user: updated });
  } catch (error) {
    console.error("adminUpdateUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/:id
export const adminDeleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("adminDeleteUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/stats
export const adminStatistics = async (req, res) => {
  try {
    const total = await User.countDocuments();

    const byRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    return res.json({ total, byRole });
  } catch (error) {
    console.error("adminStatistics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
