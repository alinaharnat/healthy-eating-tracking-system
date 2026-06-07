import Foundation

struct Report: Decodable, Identifiable {
    let id: String
    let userId: String?
    let fileUrl: String
    let createdAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, _id, userId, fileUrl, createdAt
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        userId = try container.decodeIfPresent(String.self, forKey: .userId)
        fileUrl = try container.decode(String.self, forKey: .fileUrl)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
    }
}

struct CreateReportRequest: Codable {
    let fileUrl: String
}
