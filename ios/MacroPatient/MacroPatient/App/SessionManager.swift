import Foundation
import Observation

@MainActor
@Observable
final class SessionManager {
    static let shared = SessionManager()

    private let authService = AuthService()
    private let userService = UserService()
    private let keychain = KeychainService.shared

    var isAuthenticated = false
    var currentUser: UserProfile?
    var isLoadingSession = false

    private init() {
        APIClient.shared.onUnauthorized = { [weak self] in
            Task { @MainActor in
                self?.clearSession()
            }
        }
    }

    func bootstrap() async {
        guard keychain.readToken() != nil else {
            isAuthenticated = false
            return
        }
        isLoadingSession = true
        defer { isLoadingSession = false }
        do {
            currentUser = try await userService.fetchProfile()
            if currentUser?.role != "client" {
                clearSession()
                return
            }
            isAuthenticated = true
        } catch {
            clearSession()
        }
    }

    func signIn(email: String, password: String) async throws {
        _ = try await authService.login(email: email, password: password)
        currentUser = try await userService.fetchProfile()
        isAuthenticated = true
    }

    func signUp(name: String, email: String, password: String) async throws {
        _ = try await authService.register(name: name, email: email, password: password)
        currentUser = try await userService.fetchProfile()
        isAuthenticated = true
    }

    func refreshProfile() async throws {
        currentUser = try await userService.fetchProfile()
    }

    func signOut() {
        authService.logout()
        clearSession()
    }

    private func clearSession() {
        isAuthenticated = false
        currentUser = nil
    }
}
