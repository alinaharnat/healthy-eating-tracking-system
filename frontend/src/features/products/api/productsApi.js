import apiClient from "../../../core/api";
import { mapProductList, mapProductModel } from "./mappers";

export async function createProduct(payload, options = {}) {
  const response = await apiClient.post("/products", payload, options);
  return mapProductModel(response);
}

export async function updateProduct(productId, payload, options = {}) {
  const response = await apiClient.put(
    `/products/${productId}`,
    payload,
    options,
  );
  return mapProductModel(response);
}

export async function getProductById(productId, options = {}) {
  const response = await apiClient.get(`/products/${productId}`, options);
  return mapProductModel(response);
}

export async function searchProducts({ search } = {}, options = {}) {
  const response = await apiClient.get("/products", {
    ...options,
    query: {
      search,
    },
  });

  return mapProductList(response || []);
}

export async function deleteProduct(productId, options = {}) {
  const response = await apiClient.delete(`/products/${productId}`, options);
  return {
    message: response?.message || "Product deleted successfully",
  };
}
