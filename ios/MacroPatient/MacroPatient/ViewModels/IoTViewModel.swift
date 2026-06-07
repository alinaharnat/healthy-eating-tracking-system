import Foundation
import Observation

@MainActor
@Observable
final class IoTViewModel {
    var measurements: [IoTMeasurement] = []
    var activity: ActivitySummary?
    var pulseText = ""
    var stepsText = ""
    var weightText = ""
    var isLoading = false
    var isSaving = false
    var errorMessage: String?

    private let iotService = IoTService()
    private let analyticsService = AnalyticsService()

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            async let latestTask = iotService.latest(period: "week")
            async let activityTask = analyticsService.activity(period: "week")
            measurements = try await latestTask
            activity = try await activityTask
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func logMeasurement() async {
        isSaving = true
        errorMessage = nil
        defer { isSaving = false }
        do {
            _ = try await iotService.create(
                pulse: Int(pulseText),
                steps: Int(stepsText),
                weight: Double(weightText)
            )
            pulseText = ""
            stepsText = ""
            weightText = ""
            await load()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}
