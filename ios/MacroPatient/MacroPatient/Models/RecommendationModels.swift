import Foundation

struct Recommendation: Decodable, Identifiable {
    let id: String
    let userId: String?
    let dietitianId: String?
    let message: String
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, _id, userId, dietitianId, message, createdAt, updatedAt
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        if let userIdString = try? container.decode(String.self, forKey: .userId) {
            userId = userIdString
        } else {
            userId = nil
        }
        dietitianId = try container.decodeIfPresent(String.self, forKey: .dietitianId)
        message = try container.decode(String.self, forKey: .message)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
        updatedAt = try container.decodeIfPresent(Date.self, forKey: .updatedAt)
    }
}
