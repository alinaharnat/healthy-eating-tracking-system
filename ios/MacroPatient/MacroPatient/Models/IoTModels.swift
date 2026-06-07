import Foundation

struct IoTMeasurement: Decodable, Identifiable {
    let id: String
    let userId: String?
    let timestamp: Date?
    let pulse: Int?
    let steps: Int?
    let weight: Double?
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, _id, userId, timestamp, pulse, steps, weight, createdAt, updatedAt
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        userId = try container.decodeIfPresent(String.self, forKey: .userId)
        timestamp = try container.decodeIfPresent(Date.self, forKey: .timestamp)
        pulse = try container.decodeIfPresent(Int.self, forKey: .pulse)
        steps = try container.decodeIfPresent(Int.self, forKey: .steps)
        weight = try container.decodeIfPresent(Double.self, forKey: .weight)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
        updatedAt = try container.decodeIfPresent(Date.self, forKey: .updatedAt)
    }
}

struct CreateIoTMeasurementRequest: Codable {
    let pulse: Int?
    let steps: Int?
    let weight: Double?
}
