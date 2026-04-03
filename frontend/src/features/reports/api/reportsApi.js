import apiClient from "../../../core/api";
import { mapReportList, mapReportModel } from "./mappers";

export async function createReport(payload, options = {}) {
  const response = await apiClient.post("/reports", payload, options);
  return mapReportModel(response);
}

export async function getMyReports(options = {}) {
  const response = await apiClient.get("/reports/my", options);
  return mapReportList(response || []);
}

export async function deleteReport(reportId, options = {}) {
  const response = await apiClient.delete(`/reports/${reportId}`, options);

  return {
    message: response?.message || "Report deleted successfully",
  };
}
