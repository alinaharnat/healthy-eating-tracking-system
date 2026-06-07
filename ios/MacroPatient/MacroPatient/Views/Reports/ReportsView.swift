import SwiftUI

struct ReportsView: View {
    @State private var viewModel = ReportsViewModel()

    var body: some View {
        NavigationStack {
            List {
                Section("Add report link") {
                    TextField("https://…/report.pdf", text: $viewModel.fileUrl)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.URL)
                        .autocorrectionDisabled()
                    Button("Save URL") {
                        Task { await viewModel.addReport() }
                    }
                    .disabled(viewModel.isSaving)
                    Text("Upload your file to cloud storage first, then paste the public URL here.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Section("My reports") {
                    if viewModel.reports.isEmpty && !viewModel.isLoading {
                        Text("No reports yet.").foregroundStyle(.secondary)
                    }
                    ForEach(viewModel.reports) { report in
                        if let url = URL(string: report.fileUrl) {
                            Link(report.fileUrl, destination: url)
                        } else {
                            Text(report.fileUrl)
                        }
                    }
                    .onDelete { indexSet in
                        for index in indexSet {
                            let report = viewModel.reports[index]
                            Task { await viewModel.delete(report) }
                        }
                    }
                }
            }
            .navigationTitle("Reports")
            .refreshable { await viewModel.load() }
            .task { await viewModel.load() }
            .overlay { ErrorBanner(message: viewModel.errorMessage) }
        }
    }
}
