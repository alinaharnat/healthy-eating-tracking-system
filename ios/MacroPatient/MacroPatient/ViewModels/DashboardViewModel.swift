import Foundation
import Observation

@MainActor
@Observable
final class DashboardViewModel {
    var overview: AnalyticsOverview?
    var isLoading = false
    var errorMessage: String?

    private let analyticsService = AnalyticsService()

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            overview = try await analyticsService.overview()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}
