import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "dietitian", "admin"],
      required: true,
    },
    age: Number,
    weight: Number,
    height: Number,
    language: { type: String, enum: ["ua", "en"], default: "ua" },
    goalType: { type: String, enum: ["lose", "maintain", "gain"] },
    dailyCalorieGoal: { type: Number, default: 0 },
    dietitianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default mongoose.model("User", UserSchema);
