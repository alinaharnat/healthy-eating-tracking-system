import Foundation

struct AnalyticsService {
    private let client = APIClient.shared

    func dailySummary(date: Date? = nil) async throws -> DailyNutritionSummary {
        var query: [String: String?] = [:]
        if let date {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            query["date"] = formatter.string(from: date)
        }
        return try await client.request("analytics/daily", query: query)
    }

    func periodAnalytics(period: String) async throws -> PeriodAnalytics {
        try await client.request("analytics/period", query: ["period": period])
    }

    func activity(period: String = "day") async throws -> ActivitySummary {
        try await client.request("analytics/activity", query: ["period": period])
    }

    func overview() async throws -> AnalyticsOverview {
        try await client.request("analytics/overview")
    }

    func generateAutoRecommendations() async throws -> AutoRecommendationsResponse {
        try await client.request("analytics/recommendations/auto", method: "POST")
    }
}
