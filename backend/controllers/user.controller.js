import User from "../models/user.js";
import mongoose from "mongoose";
import DietitianAssignmentRequest from "../models/dietitianAssignmentRequest.js";

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

function normalizeRequest(dto = {}) {
  const client =
    dto.clientId && typeof dto.clientId === "object" ? dto.clientId : null;
  const dietitian =
    dto.dietitianId && typeof dto.dietitianId === "object"
      ? dto.dietitianId
      : null;

  return {
    id: dto.id || dto._id,
    clientId: client?._id || client?.id || dto.clientId,
    dietitianId: dietitian?._id || dietitian?.id || dto.dietitianId,
    status: dto.status,
    message: dto.message || "",
    respondedAt: dto.respondedAt || null,
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
    client: client
      ? {
          id: client._id || client.id,
          name: client.name,
          email: client.email,
          isActive: client.isActive,
        }
      : null,
    dietitian: dietitian
      ? {
          id: dietitian._id || dietitian.id,
          name: dietitian.name,
          email: dietitian.email,
          isActive: dietitian.isActive,
        }
      : null,
  };
}

/** GET /api/users/me */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/users/me */
export const updateMe = async (req, res) => {
  try {
    const allowed = [
      "name",
      "language",
      "age",
      "height",
      "weight",
      "goalType",
      "dailyCalorieGoal",
    ];

    const data = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    });

    const updated = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    console.error("updateMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/users/patients (dietitian only) */
export const listPatients = async (req, res) => {
  try {
    const patients = await User.find(
      { dietitianId: req.user._id },
      "name email role goalType language age height weight dailyCalorieGoal dietitianId isActive",
    ).sort({ name: 1 });

    return res.json(patients);
  } catch (error) {
    console.error("listPatients error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** DELETE /api/users/patients/:patientId/assignment (dietitian only) */
export const unassignPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!isValidObjectId(patientId)) {
      return res.status(400).json({ message: "Invalid patientId" });
    }

    const patient = await User.findOne({
      _id: patientId,
      role: "client",
      dietitianId: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.dietitianId = null;
    await patient.save();

    await DietitianAssignmentRequest.updateMany(
      {
        clientId: patient._id,
        dietitianId: req.user._id,
        status: "pending",
      },
      {
        $set: {
          status: "cancelled",
          respondedAt: new Date(),
          respondedBy: req.user._id,
          message:
            "Request was closed because the dietitian unassigned this patient.",
        },
      },
    );

    return res.json({
      message: "Patient was unassigned successfully",
      patientId,
    });
  } catch (error) {
    console.error("unassignPatient error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/users/dietitians (client/admin) */
export const listDietitians = async (req, res) => {
  try {
    const dietitians = await User.find(
      { role: "dietitian", isActive: true },
      "name email isActive",
    ).sort({ name: 1 });

    return res.json(dietitians);
  } catch (error) {
    console.error("listDietitians error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** POST /api/users/dietitian-requests (client) */
export const createDietitianRequest = async (req, res) => {
  try {
    const { dietitianId, message = "" } = req.body;

    if (!isValidObjectId(dietitianId)) {
      return res.status(400).json({ message: "Invalid dietitianId" });
    }

    const client = await User.findById(req.user._id);

    if (!client || client.role !== "client") {
      return res
        .status(403)
        .json({ message: "Only clients can send requests" });
    }

    if (client.dietitianId) {
      return res
        .status(409)
        .json({ message: "Client already has an assigned dietitian" });
    }

    const dietitian = await User.findOne({
      _id: dietitianId,
      role: "dietitian",
      isActive: true,
    });

    if (!dietitian) {
      return res.status(404).json({ message: "Dietitian not found" });
    }

    const existingPending = await DietitianAssignmentRequest.findOne({
      clientId: req.user._id,
      dietitianId,
      status: "pending",
    });

    if (existingPending) {
      return res
        .status(409)
        .json({ message: "Pending request already exists" });
    }

    const request = await DietitianAssignmentRequest.create({
      clientId: req.user._id,
      dietitianId,
      status: "pending",
      message: String(message || "").trim(),
    });

    return res.status(201).json(normalizeRequest(request));
  } catch (error) {
    console.error("createDietitianRequest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/users/dietitian-requests/outgoing (client) */
export const listOutgoingDietitianRequests = async (req, res) => {
  try {
    const requests = await DietitianAssignmentRequest.find({
      clientId: req.user._id,
    })
      .populate("dietitianId", "name email isActive")
      .sort({ createdAt: -1 });

    return res.json(requests.map(normalizeRequest));
  } catch (error) {
    console.error("listOutgoingDietitianRequests error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/users/dietitian-requests/incoming (dietitian) */
export const listIncomingDietitianRequests = async (req, res) => {
  try {
    const status = req.query.status;
    const criteria = {
      dietitianId: req.user._id,
    };

    if (
      status &&
      ["pending", "accepted", "rejected", "cancelled"].includes(status)
    ) {
      criteria.status = status;
    }

    const requests = await DietitianAssignmentRequest.find(criteria)
      .populate("clientId", "name email isActive")
      .sort({ createdAt: -1 });

    return res.json(requests.map(normalizeRequest));
  } catch (error) {
    console.error("listIncomingDietitianRequests error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/users/dietitian-requests/:requestId/respond (dietitian) */
export const respondDietitianRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { decision, message = "" } = req.body;

    if (!isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid requestId" });
    }

    if (!["accepted", "rejected"].includes(decision)) {
      return res
        .status(400)
        .json({ message: "Decision must be accepted or rejected" });
    }

    const request = await DietitianAssignmentRequest.findOne({
      _id: requestId,
      dietitianId: req.user._id,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Pending request not found" });
    }

    const now = new Date();

    if (decision === "accepted") {
      const client = await User.findOne({
        _id: request.clientId,
        role: "client",
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      if (
        client.dietitianId &&
        String(client.dietitianId) !== String(req.user._id)
      ) {
        return res
          .status(409)
          .json({ message: "Client is already assigned to another dietitian" });
      }

      client.dietitianId = req.user._id;
      await client.save();

      await DietitianAssignmentRequest.updateMany(
        {
          clientId: client._id,
          status: "pending",
          _id: { $ne: request._id },
        },
        {
          $set: {
            status: "rejected",
            respondedAt: now,
            respondedBy: req.user._id,
            message:
              "Request was automatically rejected because another request was accepted.",
          },
        },
      );
    }

    request.status = decision;
    request.respondedAt = now;
    request.respondedBy = req.user._id;
    request.message = String(message || request.message || "").trim();

    await request.save();
    await request.populate("clientId", "name email isActive");

    return res.json(normalizeRequest(request));
  } catch (error) {
    console.error("respondDietitianRequest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
