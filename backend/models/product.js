import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: Number,
  fat: Number,
  carbs: Number,
});
export default mongoose.model("Product", ProductSchema);
