import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model("User", UserSchema);
