import apiClient from "../../../core/api";
import { mapMeasurementList, mapMeasurementModel } from "./mappers";

export async function createMeasurement(payload, options = {}) {
  const response = await apiClient.post("/iot-measurements", payload, options);
  return mapMeasurementModel(response);
}

export async function getLatestMeasurements(options = {}) {
  const response = await apiClient.get("/iot-measurements/latest", options);
  return mapMeasurementList(response || []);
}

export async function deleteMeasurement(measurementId, options = {}) {
  const response = await apiClient.delete(
    `/iot-measurements/${measurementId}`,
    options,
  );

  return {
    message: response?.message || "Measurement deleted successfully",
  };
}
