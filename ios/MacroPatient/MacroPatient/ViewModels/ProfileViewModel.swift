import Foundation
import Observation

@MainActor
@Observable
final class ProfileViewModel {
    var name = ""
    var age = ""
    var height = ""
    var weight = ""
    var goalType: GoalType = .maintain
    var dailyCalorieGoal = ""
    var language = "en"
    var isLoading = false
    var isSaving = false
    var errorMessage: String?
    var successMessage: String?

    private let userService = UserService()
    private let session = SessionManager.shared

    func loadFromSession() {
        guard let user = session.currentUser else { return }
        name = user.name
        age = user.age.map(String.init) ?? ""
        height = user.height.map { String(format: "%.0f", $0) } ?? ""
        weight = user.weight.map { String(format: "%.1f", $0) } ?? ""
        goalType = user.goalType ?? .maintain
        dailyCalorieGoal = user.dailyCalorieGoal.map(String.init) ?? ""
        language = user.language ?? "en"
    }

    func save() async {
        isSaving = true
        errorMessage = nil
        successMessage = nil
        defer { isSaving = false }

        var update = UpdateProfileRequest()
        update.name = name
        update.language = language
        update.age = Int(age)
        update.height = Double(height)
        update.weight = Double(weight)
        update.goalType = goalType
        update.dailyCalorieGoal = Int(dailyCalorieGoal)

        do {
            let updated = try await userService.updateProfile(update)
            session.currentUser = updated
            successMessage = "Profile updated."
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}
