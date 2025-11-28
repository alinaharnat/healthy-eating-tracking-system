import mongoose from "mongoose";

const IoTSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    timestamp: { type: Date, required: true, index: true },
    pulse: Number,
    steps: Number,
    weight: Number,
  },
  { timestamps: true }
);

export default mongoose.model("IoTMeasurement", IoTSchema);
