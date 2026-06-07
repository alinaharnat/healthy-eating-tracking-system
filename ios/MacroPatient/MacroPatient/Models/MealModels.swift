import Foundation

enum MealType: String, Codable, CaseIterable, Identifiable {
    case breakfast
    case lunch
    case dinner
    case snack

    var id: String { rawValue }

    var displayName: String {
        rawValue.capitalized
    }
}

struct Product: Decodable, Identifiable {
    let id: String
    let name: String
    let normalizedName: String?
    let calories: Double
    let proteins: Double
    let fats: Double
    let carbs: Double

    enum CodingKeys: String, CodingKey {
        case id, _id, name, normalizedName, calories, proteins, fats, carbs
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        name = try container.decode(String.self, forKey: .name)
        normalizedName = try container.decodeIfPresent(String.self, forKey: .normalizedName)
        calories = try container.decode(Double.self, forKey: .calories)
        proteins = try container.decode(Double.self, forKey: .proteins)
        fats = try container.decode(Double.self, forKey: .fats)
        carbs = try container.decode(Double.self, forKey: .carbs)
    }
}

struct CustomProductInput: Codable {
    let name: String
    let calories: Double
    let proteins: Double
    let fats: Double
    let carbs: Double
}

struct MealProductInput: Codable {
    var productId: String?
    var customProduct: CustomProductInput?
    let weightGrams: Double
}

struct CreateMealRequest: Codable {
    let date: Date
    let mealType: MealType
    let mealProducts: [MealProductInput]
}

struct MealProductLine: Decodable, Identifiable {
    let id: String
    let source: String?
    let productId: Product?
    let customProduct: CustomProductInput?
    let weightGrams: Double

    enum CodingKeys: String, CodingKey {
        case id, _id, source, productId, customProduct, weightGrams
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(String.self, forKey: .id)
            ?? container.decode(String.self, forKey: ._id)
        source = try container.decodeIfPresent(String.self, forKey: .source)
        productId = try container.decodeIfPresent(Product.self, forKey: .productId)
        customProduct = try container.decodeIfPresent(CustomProductInput.self, forKey: .customProduct)
        weightGrams = try container.decode(Double.self, forKey: .weightGrams)
    }

    var displayName: String {
        productId?.name ?? customProduct?.name ?? "Item"
    }

    func nutrients(for keyPath: KeyPath<Product, Double>) -> Double {
        let per100: Double
        if let product = productId {
            per100 = product[keyPath: keyPath]
        } else if let custom = customProduct {
            switch keyPath {
            case \Product.calories: per100 = custom.calories
            case \Product.proteins: per100 = custom.proteins
            case \Product.fats: per100 = custom.fats
            case \Product.carbs: per100 = custom.carbs
            default: per100 = 0
            }
        } else {
            per100 = 0
        }
        return per100 * weightGrams / 100
    }

    var calories: Double { nutrients(for: \.calories) }
    var proteins: Double { nutrients(for: \.proteins) }
    var fats: Double { nutrients(for: \.fats) }
    var carbs: Double { nutrients(for: \.carbs) }
}

struct Meal: Decodable, Identifiable {
    let id: String
    let userId: String?
    let date: Date
    let mealType: MealType
    let mealProducts: [MealProductLine]
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, _id, userId, date, mealType, mealProducts, createdAt, updatedAt
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
        date = try container.decode(Date.self, forKey: .date)
        mealType = try container.decode(MealType.self, forKey: .mealType)
        mealProducts = try container.decode([MealProductLine].self, forKey: .mealProducts)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
        updatedAt = try container.decodeIfPresent(Date.self, forKey: .updatedAt)
    }

    var totalCalories: Double {
        mealProducts.reduce(0) { $0 + $1.calories }
    }
}

struct RemoveProductRequest: Codable {
    let productId: String?
    let itemId: String?
}
