import Foundation

protocol MongoIdentifiable: Identifiable where ID == String {}

struct MongoID: Codable, Hashable {
    let value: String

    init(_ value: String) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let string = try? container.decode(String.self) {
            self.value = string
            return
        }
        throw DecodingError.dataCorruptedError(in: container, debugDescription: "Expected string id")
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(value)
    }
}

/// Decodes Mongo-style documents that expose `_id` or `id`.
struct DocumentID: Codable, Hashable {
    let value: String

    var id: String { value }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        if let id = try container.decodeIfPresent(String.self, forKey: .id) {
            self.value = id
            return
        }
        if let id = try container.decodeIfPresent(String.self, forKey: ._id) {
            self.value = id
            return
        }
        throw DecodingError.keyNotFound(
            CodingKeys.id,
            .init(codingPath: decoder.codingPath, debugDescription: "Missing id/_id")
        )
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(value, forKey: .id)
    }

    private enum CodingKeys: String, CodingKey {
        case id
        case _id
    }
}
