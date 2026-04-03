export function mapAuthSessionModel(dto = {}) {
  return {
    id: dto.id || dto._id || "",
    name: dto.name || "",
    email: dto.email || "",
    role: dto.role || "client",
    token: dto.token || "",
  };
}
