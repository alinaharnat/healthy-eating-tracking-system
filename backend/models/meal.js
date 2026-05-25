import mongoose from "mongoose";

const CustomMealProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    proteins: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
    carbs: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const MealProductSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["catalog", "custom"],
      default: "catalog",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: function requiredProductId() {
        return this.source !== "custom";
      },
    },
    customProduct: {
      type: CustomMealProductSchema,
      required: function requiredCustomProduct() {
        return this.source === "custom";
      },
      default: undefined,
    },
    weightGrams: { type: Number, required: true },
  },
  { _id: true },
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
  { timestamps: true },
);

export default mongoose.model("Meal", MealSchema);
