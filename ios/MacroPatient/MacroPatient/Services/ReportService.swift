import Foundation

struct ReportService {
    private let client = APIClient.shared

    func fetchMine() async throws -> [Report] {
        try await client.request("reports/my")
    }

    func create(fileUrl: String) async throws -> Report {
        try await client.request("reports", method: "POST", body: CreateReportRequest(fileUrl: fileUrl))
    }

    func delete(id: String) async throws {
        try await client.requestVoid("reports/\(id)", method: "DELETE")
    }
}
