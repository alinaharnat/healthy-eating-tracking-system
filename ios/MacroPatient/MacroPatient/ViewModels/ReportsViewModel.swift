import Foundation
import Observation

@MainActor
@Observable
final class ReportsViewModel {
    var reports: [Report] = []
    var fileUrl = ""
    var isLoading = false
    var isSaving = false
    var errorMessage: String?

    private let reportService = ReportService()

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            reports = try await reportService.fetchMine()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func addReport() async {
        let url = fileUrl.trimmingCharacters(in: .whitespaces)
        guard url.hasPrefix("http://") || url.hasPrefix("https://") else {
            errorMessage = "Enter a valid http(s) file URL."
            return
        }
        isSaving = true
        defer { isSaving = false }
        do {
            _ = try await reportService.create(fileUrl: url)
            fileUrl = ""
            await load()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func delete(_ report: Report) async {
        do {
            try await reportService.delete(id: report.id)
            reports.removeAll { $0.id == report.id }
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}
