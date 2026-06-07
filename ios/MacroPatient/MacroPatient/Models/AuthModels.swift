import Foundation

struct AuthPayload: Codable {
    let id: String
    let name: String?
    let email: String
    let role: String
    let token: String
}

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct RegisterRequest: Codable {
    let name: String
    let email: String
    let password: String
    let role: String = "client"
}

struct AuthSuccessResponse: Codable {
    let success: Bool?
    let data: AuthPayload
}
