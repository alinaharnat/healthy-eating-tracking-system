import Foundation

struct MealService {
    private let client = APIClient.shared

    func meals(for date: Date) async throws -> [Meal] {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        return try await client.request(
            "meals/by-date",
            query: ["date": formatter.string(from: date)]
        )
    }

    func history(period: String = "week") async throws -> [Meal] {
        try await client.request("meals/history", query: ["period": period])
    }

    func createMeal(_ request: CreateMealRequest) async throws -> Meal {
        try await client.request("meals", method: "POST", body: request)
    }

    func deleteMeal(id: String) async throws {
        try await client.requestVoid("meals/\(id)", method: "DELETE")
    }
}
