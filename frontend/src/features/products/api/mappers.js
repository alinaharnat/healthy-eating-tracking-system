function toNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function mapProductModel(dto = {}) {
  return {
    id: dto.id || dto._id || "",
    name: dto.name || "",
    normalizedName: dto.normalizedName || "",
    calories: toNumber(dto.calories),
    proteins: toNumber(dto.proteins),
    fats: toNumber(dto.fats),
    carbs: toNumber(dto.carbs),
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
  };
}

export function mapProductList(items = []) {
  return items.map(mapProductModel);
}
