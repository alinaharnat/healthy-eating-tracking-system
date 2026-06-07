import Foundation

struct ProductService {
    private let client = APIClient.shared

    func search(query: String) async throws -> [Product] {
        var params: [String: String?] = [:]
        if !query.trimmingCharacters(in: .whitespaces).isEmpty {
            params["search"] = query
        }
        return try await client.request("products", query: params)
    }

    func fetchProduct(id: String) async throws -> Product {
        try await client.request("products/\(id)")
    }
}
