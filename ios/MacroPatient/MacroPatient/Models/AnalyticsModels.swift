import Foundation

struct NutritionTotals: Codable {
    let calories: Double
    let proteins: Double
    let fats: Double
    let carbs: Double
}

struct DailyNutritionSummary: Codable {
    let date: String
    let totals: NutritionTotals
    let goal: Double?
    let status: String
}

struct DayNutrition: Codable, Identifiable {
    var id: String { date }
    let date: String
    let calories: Double
    let proteins: Double
    let fats: Double
    let carbs: Double
}

struct PeriodAnalytics: Codable {
    let period: String
    let averageCalories: Double
    let minCalories: Double
    let maxCalories: Double
    let criticalDay: DayNutrition?
    let days: [DayNutrition]
}

struct ActivitySummary: Codable {
    let period: String
    let totalSteps: Int
    let burnedCalories: Double
    let lastWeight: Double?
    let lastMeasurementAt: Date?
}

struct AnalyticsOverview: Codable {
    let userId: String
    let dailyNutrition: DailyNutritionSummary
    let weeklyNutrition: PeriodAnalytics
    let monthlyNutrition: PeriodAnalytics
    let activity: ActivitySummary
}

struct AutoRecommendationsResponse: Decodable {
    let generated: Int
    let recommendations: [Recommendation]
}
