export function mapReportModel(dto = {}) {
  return {
    id: dto.id || dto._id || "",
    userId: dto.userId || null,
    fileUrl: dto.fileUrl || "",
    createdAt: dto.createdAt || null,
    updatedAt: dto.updatedAt || null,
  };
}

export function mapReportList(items = []) {
  return items.map(mapReportModel);
}
