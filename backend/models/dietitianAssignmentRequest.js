import mongoose from "mongoose";

const DietitianAssignmentRequestSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dietitianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "canceled"],
      default: "pending",
      index: true,
    },
    message: { type: String, default: "" },
    respondedAt: { type: Date, default: null },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// Only one pending request is allowed for a client-dietitian pair.
DietitianAssignmentRequestSchema.index(
  { clientId: 1, dietitianId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  },
);

// A client can have only one active pending request at a time.
DietitianAssignmentRequestSchema.index(
  { clientId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  },
);

export default mongoose.model(
  "DietitianAssignmentRequest",
  DietitianAssignmentRequestSchema,
);
