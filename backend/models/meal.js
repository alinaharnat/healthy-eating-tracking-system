import mongoose from "mongoose";
const MealProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    weightGrams: { type: Number, required: true },
  },
  { _id: false }
);
const MealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    mealProducts: { type: [MealProductSchema], required: true },
  },
  { timestamps: true }
);
export default mongoose.model("Meal", MealSchema);
