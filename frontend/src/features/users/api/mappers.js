function mapNullableNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function mapUserModel(dto = {}) {
  const dietitian =
    dto.dietitian && typeof dto.dietitian === "object"
      ? dto.dietitian
      : dto.dietitianId && typeof dto.dietitianId === "object"
        ? dto.dietitianId
        : null;

  return {
    id: dto.id || dto._id || "",
    name: dto.name || "",
    email: dto.email || "",
    role: dto.role || "client",
    language: dto.language || "en",
    age: mapNullableNumber(dto.age),
    weight: mapNullableNumber(dto.weight),
    height: mapNullableNumber(dto.height),
    goalType: dto.goalType || null,
    dailyCalorieGoal: mapNullableNumber(dto.dailyCalorieGoal) || 0,
    dietitianId:
      (dietitian && (dietitian.id || dietitian._id)) || dto.dietitianId || null,
    dietitian: dietitian
      ? {
          id: dietitian.id || dietitian._id || "",
          name: dietitian.name || "",
          email: dietitian.email || "",
          role: dietitian.role || "dietitian",
          isActive: dietitian.isActive !== false,
        }
      : null,
    isActive: dto.isActive !== false,
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
  };
}

export function mapPatientModel(dto = {}) {
  return {
    id: dto.id || dto._id || "",
    name: dto.name || "",
    email: dto.email || "",
    role: dto.role || "client",
    goalType: dto.goalType || null,
    language: dto.language || "en",
    age: mapNullableNumber(dto.age),
    weight: mapNullableNumber(dto.weight),
    height: mapNullableNumber(dto.height),
    dailyCalorieGoal: mapNullableNumber(dto.dailyCalorieGoal),
    dietitianId: dto.dietitianId || null,
    isActive: dto.isActive !== false,
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
  };
}

export function mapUserList(items = []) {
  return items.map(mapUserModel);
}

export function mapPatientList(items = []) {
  return items.map(mapPatientModel);
}

export function mapDietitianAssignmentRequestModel(dto = {}) {
  const client =
    dto.client && typeof dto.client === "object" ? dto.client : null;
  const dietitian =
    dto.dietitian && typeof dto.dietitian === "object" ? dto.dietitian : null;

  return {
    id: dto.id || dto._id || "",
    clientId: (client && (client.id || client._id)) || dto.clientId || null,
    dietitianId:
      (dietitian && (dietitian.id || dietitian._id)) || dto.dietitianId || null,
    status: dto.status || "pending",
    message: dto.message || "",
    respondedAt: dto.respondedAt || null,
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
    client: client
      ? {
          id: client.id || client._id || "",
          name: client.name || "",
          email: client.email || "",
          isActive: client.isActive !== false,
        }
      : null,
    dietitian: dietitian
      ? {
          id: dietitian.id || dietitian._id || "",
          name: dietitian.name || "",
          email: dietitian.email || "",
          isActive: dietitian.isActive !== false,
        }
      : null,
  };
}

export function mapDietitianAssignmentRequestList(items = []) {
  return items.map(mapDietitianAssignmentRequestModel);
}
