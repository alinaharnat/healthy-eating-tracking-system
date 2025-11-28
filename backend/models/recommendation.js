import mongoose from "mongoose";
const RecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dietitianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Recommendation", RecommendationSchema);
