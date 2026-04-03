function mapNullableNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function mapUserModel(dto = {}) {
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
    dietitianId: dto.dietitianId || null,
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
