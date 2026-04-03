import { mapMeasurementList } from "../../iot/api/mappers";
import { mapMealList } from "../../meals/api/mappers";
import { mapProductModel } from "../../products/api/mappers";
import { mapUserModel, mapUserList } from "../../users/api/mappers";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function mapAdminUserList(items = []) {
  return mapUserList(items);
}

export function mapAdminUserActionResult(dto = {}) {
  return {
    message: dto.message || "",
    user: dto.user ? mapUserModel(dto.user) : null,
  };
}

export function mapAdminUserActivity(dto = {}) {
  return {
    user: dto.user ? mapUserModel(dto.user) : null,
    meals: mapMealList(dto.meals || []),
    measurements: mapMeasurementList(dto.measurements || []),
  };
}

export function mapAdminProductActionResult(dto = {}) {
  return {
    message: dto.message || "",
    product: dto.product ? mapProductModel(dto.product) : null,
  };
}

export function mapSystemStatistics(dto = {}) {
  const mostUsedProducts = Array.isArray(dto.mostUsedProducts)
    ? dto.mostUsedProducts.map((item) => ({
        usage: toNumber(item.usage),
        product: item.product ? mapProductModel(item.product) : null,
      }))
    : [];

  return {
    usersCount: toNumber(dto.usersCount),
    rolesCount: {
      client: toNumber(dto?.rolesCount?.client),
      dietitian: toNumber(dto?.rolesCount?.dietitian),
      admin: toNumber(dto?.rolesCount?.admin),
    },
    mostUsedProducts,
    averageCalories: toNumber(dto.averageCalories),
  };
}

export function mapDatabaseExport(dto = {}) {
  return {
    users: mapUserList(dto.users || []),
    products: (dto.products || []).map(mapProductModel),
    meals: mapMealList(dto.meals || []),
    measurements: mapMeasurementList(dto.measurements || []),
  };
}

export function mapAdminMessage(dto = {}, fallbackMessage = "") {
  return {
    message: dto.message || fallbackMessage,
  };
}
