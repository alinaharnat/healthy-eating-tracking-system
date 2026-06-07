import Foundation

struct UserService {
    private let client = APIClient.shared

    func fetchProfile() async throws -> UserProfile {
        try await client.request("users/me")
    }

    func updateProfile(_ update: UpdateProfileRequest) async throws -> UserProfile {
        try await client.request("users/me", method: "PATCH", body: update)
    }

    func fetchDietitians() async throws -> [DietitianListItem] {
        try await client.request("users/dietitians")
    }

    func createDietitianRequest(dietitianId: String, message: String?) async throws -> DietitianAssignmentRequest {
        try await client.request(
            "users/dietitian-requests",
            method: "POST",
            body: CreateDietitianRequestBody(dietitianId: dietitianId, message: message)
        )
    }

    func fetchOutgoingRequests() async throws -> [DietitianAssignmentRequest] {
        try await client.request("users/dietitian-requests/outgoing")
    }

    func cancelRequest(requestId: String) async throws -> DietitianAssignmentRequest {
        try await client.request(
            "users/dietitian-requests/\(requestId)/cancel",
            method: "PATCH"
        )
    }
}
