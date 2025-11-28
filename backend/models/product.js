import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  normalizedName: { type: String, required: true, unique: true },
  calories: { type: Number, required: true },
  proteins: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
});

export default mongoose.model("Product", ProductSchema);
