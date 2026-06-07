import Foundation

struct UserProfile: Codable, Identifiable {
    let id: String
    var name: String
    let email: String
    let role: String
    var age: Int?
    var weight: Double?
    var height: Double?
    var language: String?
    var goalType: GoalType?
    var dailyCalorieGoal: Int?
    let dietitianId: String?
    let dietitian: DietitianSummary?
    let isActive: Bool?
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, _id, name, email, role, age, weight, height, language
        case goalType, dailyCalorieGoal, dietitianId, dietitian, isActive
        case createdAt, updatedAt
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        name = try container.decode(String.self, forKey: .name)
        email = try container.decode(String.self, forKey: .email)
        role = try container.decode(String.self, forKey: .role)
        age = try container.decodeIfPresent(Int.self, forKey: .age)
        weight = try container.decodeIfPresent(Double.self, forKey: .weight)
        height = try container.decodeIfPresent(Double.self, forKey: .height)
        language = try container.decodeIfPresent(String.self, forKey: .language)
        goalType = try container.decodeIfPresent(GoalType.self, forKey: .goalType)
        dailyCalorieGoal = try container.decodeIfPresent(Int.self, forKey: .dailyCalorieGoal)
        dietitianId = try container.decodeIfPresent(String.self, forKey: .dietitianId)
        dietitian = try container.decodeIfPresent(DietitianSummary.self, forKey: .dietitian)
        isActive = try container.decodeIfPresent(Bool.self, forKey: .isActive)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
        updatedAt = try container.decodeIfPresent(Date.self, forKey: .updatedAt)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(email, forKey: .email)
        try container.encode(role, forKey: .role)
        try container.encodeIfPresent(age, forKey: .age)
        try container.encodeIfPresent(weight, forKey: .weight)
        try container.encodeIfPresent(height, forKey: .height)
        try container.encodeIfPresent(language, forKey: .language)
        try container.encodeIfPresent(goalType, forKey: .goalType)
        try container.encodeIfPresent(dailyCalorieGoal, forKey: .dailyCalorieGoal)
    }
}

struct DietitianSummary: Decodable, Identifiable {
    let id: String
    let name: String
    let email: String
    let role: String?
    let isActive: Bool?

    enum CodingKeys: String, CodingKey {
        case id, _id, name, email, role, isActive
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        name = try container.decode(String.self, forKey: .name)
        email = try container.decode(String.self, forKey: .email)
        role = try container.decodeIfPresent(String.self, forKey: .role)
        isActive = try container.decodeIfPresent(Bool.self, forKey: .isActive)
    }
}

enum GoalType: String, Codable, CaseIterable, Identifiable {
    case lose
    case maintain
    case gain

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .lose: return "Lose weight"
        case .maintain: return "Maintain"
        case .gain: return "Gain weight"
        }
    }
}

struct UpdateProfileRequest: Codable {
    var name: String?
    var language: String?
    var age: Int?
    var height: Double?
    var weight: Double?
    var goalType: GoalType?
    var dailyCalorieGoal: Int?
}

struct DietitianListItem: Decodable, Identifiable {
    let id: String
    let name: String
    let email: String
    let role: String
    let isActive: Bool

    enum CodingKeys: String, CodingKey {
        case id, _id, name, email, role, isActive
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        name = try container.decode(String.self, forKey: .name)
        email = try container.decode(String.self, forKey: .email)
        role = try container.decode(String.self, forKey: .role)
        isActive = try container.decode(Bool.self, forKey: .isActive)
    }
}

struct DietitianAssignmentRequest: Decodable, Identifiable {
    let id: String
    let clientId: String?
    let dietitianId: String?
    let status: String
    let message: String?
    let respondedAt: Date?
    let createdAt: Date?
    let updatedAt: Date?
    let dietitian: DietitianSummary?

    enum CodingKeys: String, CodingKey {
        case id, _id, clientId, dietitianId, status, message
        case respondedAt, createdAt, updatedAt, dietitian
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        clientId = try container.decodeIfPresent(String.self, forKey: .clientId)
        dietitianId = try container.decodeIfPresent(String.self, forKey: .dietitianId)
        status = try container.decode(String.self, forKey: .status)
        message = try container.decodeIfPresent(String.self, forKey: .message)
        respondedAt = try container.decodeIfPresent(Date.self, forKey: .respondedAt)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
        updatedAt = try container.decodeIfPresent(Date.self, forKey: .updatedAt)
        dietitian = try container.decodeIfPresent(DietitianSummary.self, forKey: .dietitian)
    }
}

struct CreateDietitianRequestBody: Codable {
    let dietitianId: String
    let message: String?
}
