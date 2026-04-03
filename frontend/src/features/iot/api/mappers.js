function toNullableNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function mapMeasurementModel(dto = {}) {
  return {
    id: dto.id || dto._id || "",
    userId: dto.userId || null,
    pulse: toNullableNumber(dto.pulse) || 0,
    steps: toNullableNumber(dto.steps) || 0,
    weight: toNullableNumber(dto.weight),
    createdAt: dto.createdAt || dto.timestamp || null,
    updatedAt: dto.updatedAt || null,
  };
}

export function mapMeasurementList(items = []) {
  return items.map(mapMeasurementModel);
}
