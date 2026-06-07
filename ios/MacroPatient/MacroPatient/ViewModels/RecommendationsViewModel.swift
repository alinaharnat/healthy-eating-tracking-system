import Foundation
import Observation

@MainActor
@Observable
final class RecommendationsViewModel {
    var recommendations: [Recommendation] = []
    var isLoading = false
    var isGenerating = false
    var errorMessage: String?

    private let recommendationService = RecommendationService()
    private let analyticsService = AnalyticsService()

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            recommendations = try await recommendationService.fetchMine()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func generateAuto() async {
        isGenerating = true
        defer { isGenerating = false }
        do {
            _ = try await analyticsService.generateAutoRecommendations()
            await load()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func delete(_ recommendation: Recommendation) async {
        do {
            try await recommendationService.delete(id: recommendation.id)
            recommendations.removeAll { $0.id == recommendation.id }
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}
