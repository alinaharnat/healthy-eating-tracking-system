import Foundation

@MainActor
final class AuthService {
    private let client = APIClient.shared
    private let keychain = KeychainService.shared

    func login(email: String, password: String) async throws -> AuthPayload {
        let payload: AuthPayload = try await client.request(
            "auth/login",
            method: "POST",
            body: LoginRequest(email: email, password: password),
            auth: false
        )
        guard payload.role == "client" else {
            throw APIError.validation(
                "This account is not a patient (role: \(payload.role)). Use a client account or register as a patient."
            )
        }
        keychain.saveToken(payload.token, userId: payload.id)
        return payload
    }

    func register(name: String, email: String, password: String) async throws -> AuthPayload {
        let payload: AuthPayload = try await client.request(
            "auth/register",
            method: "POST",
            body: RegisterRequest(name: name, email: email, password: password),
            auth: false
        )
        keychain.saveToken(payload.token, userId: payload.id)
        return payload
    }

    func logout() {
        keychain.deleteToken()
    }

    var isLoggedIn: Bool {
        keychain.readToken() != nil
    }
}
