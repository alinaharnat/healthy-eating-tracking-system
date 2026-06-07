import Foundation
import Observation

@MainActor
@Observable
final class DietitianViewModel {
    var dietitians: [DietitianListItem] = []
    var outgoingRequests: [DietitianAssignmentRequest] = []
    var selectedDietitianId: String?
    var requestMessage = ""
    var isLoading = false
    var isSubmitting = false
    var errorMessage: String?
    var successMessage: String?

    private let userService = UserService()

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            async let dietitiansTask = userService.fetchDietitians()
            async let requestsTask = userService.fetchOutgoingRequests()
            dietitians = try await dietitiansTask
            outgoingRequests = try await requestsTask
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func submitRequest() async {
        guard let dietitianId = selectedDietitianId else {
            errorMessage = "Select a dietitian."
            return
        }
        isSubmitting = true
        errorMessage = nil
        successMessage = nil
        defer { isSubmitting = false }
        do {
            _ = try await userService.createDietitianRequest(
                dietitianId: dietitianId,
                message: requestMessage.isEmpty ? nil : requestMessage
            )
            successMessage = "Request sent."
            requestMessage = ""
            selectedDietitianId = nil
            await load()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func cancelRequest(_ request: DietitianAssignmentRequest) async {
        do {
            _ = try await userService.cancelRequest(requestId: request.id)
            await load()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}
