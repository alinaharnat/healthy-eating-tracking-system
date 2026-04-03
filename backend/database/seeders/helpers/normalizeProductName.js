export function normalizeProductName(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Product name must be a non-empty string");
  }

  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
