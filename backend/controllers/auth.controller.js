import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Реєстрація
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Користувач вже існує" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "client",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Логін
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email і пароль обов'язкові" });

    const user = await User.findOne({ email });

    if (!user || !user.isActive)
      return res.status(401).json({ message: "Невірні дані" });

    const isMatch = user.comparePassword
      ? await user.comparePassword(password)
      : await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Невірні дані" });

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Поточний користувач
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
};
