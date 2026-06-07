import Foundation
import Observation

@MainActor
@Observable
final class AuthViewModel {
    var email = ""
    var password = ""
    var name = ""
    var isLoading = false
    var errorMessage: String?

    private let session = SessionManager.shared

    func login() async -> Bool {
        guard validateLogin() else { return false }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            try await session.signIn(email: email.trimmingCharacters(in: .whitespaces), password: password)
            return true
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
            return false
        }
    }

    func register() async -> Bool {
        guard validateRegister() else { return false }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            try await session.signUp(
                name: name.trimmingCharacters(in: .whitespaces),
                email: email.trimmingCharacters(in: .whitespaces),
                password: password
            )
            return true
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
            return false
        }
    }

    private func validateLogin() -> Bool {
        if email.isEmpty || password.isEmpty {
            errorMessage = "Email and password are required."
            return false
        }
        return true
    }

    private func validateRegister() -> Bool {
        if name.isEmpty || email.isEmpty || password.count < 6 {
            errorMessage = "Name, email, and password (min 6 characters) are required."
            return false
        }
        return true
    }
}
