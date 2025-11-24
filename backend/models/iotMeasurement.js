const { Schema, model, Types } = require("mongoose");
const IoTSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    pulse: Number,
    steps: Number,
    weight: Number,
  },
  { timestamps: true }
);
module.exports = model("IoTMeasurement", IoTSchema);
