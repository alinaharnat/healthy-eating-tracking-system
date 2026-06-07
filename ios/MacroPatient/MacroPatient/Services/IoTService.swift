import Foundation

struct IoTService {
    private let client = APIClient.shared

    func latest(period: String? = nil) async throws -> [IoTMeasurement] {
        var query: [String: String?] = [:]
        if let period {
            query["period"] = period
        }
        return try await client.request("iot-measurements/latest", query: query)
    }

    func create(pulse: Int?, steps: Int?, weight: Double?) async throws -> IoTMeasurement {
        try await client.request(
            "iot-measurements",
            method: "POST",
            body: CreateIoTMeasurementRequest(pulse: pulse, steps: steps, weight: weight)
        )
    }

    func delete(id: String) async throws {
        try await client.requestVoid("iot-measurements/\(id)", method: "DELETE")
    }
}
