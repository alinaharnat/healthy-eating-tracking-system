export function mapRecommendationModel(dto = {}) {
  const user = dto.userId && typeof dto.userId === "object" ? dto.userId : null;
  const dietitian =
    dto.dietitianId && typeof dto.dietitianId === "object"
      ? dto.dietitianId
      : null;

  return {
    id: dto.id || dto._id || "",
    userId: (user && (user.id || user._id)) || dto.userId || null,
    dietitianId:
      (dietitian && (dietitian.id || dietitian._id)) || dto.dietitianId || null,
    message: dto.message || "",
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
  };
}

export function mapRecommendationList(items = []) {
  return items.map(mapRecommendationModel);
}
