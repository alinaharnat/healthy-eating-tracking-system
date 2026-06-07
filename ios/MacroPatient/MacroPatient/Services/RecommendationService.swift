import Foundation

struct RecommendationService {
    private let client = APIClient.shared

    func fetchMine() async throws -> [Recommendation] {
        try await client.request("recommendations/my")
    }

    func delete(id: String) async throws {
        try await client.requestVoid("recommendations/\(id)", method: "DELETE")
    }
}
