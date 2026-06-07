import SwiftUI

struct RecommendationsView: View {
    @State private var viewModel = RecommendationsViewModel()

    var body: some View {
        NavigationStack {
            List {
                if viewModel.recommendations.isEmpty && !viewModel.isLoading {
                    EmptyStateView(title: "No recommendations", systemImage: "lightbulb")
                }
                ForEach(viewModel.recommendations) { item in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(item.message)
                        if let date = item.createdAt {
                            Text(date.formatted(date: .abbreviated, time: .shortened))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .swipeActions {
                        Button(role: .destructive) {
                            Task { await viewModel.delete(item) }
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
                }
            }
            .navigationTitle("Tips")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("Generate") {
                        Task { await viewModel.generateAuto() }
                    }
                    .disabled(viewModel.isGenerating)
                }
            }
            .refreshable { await viewModel.load() }
            .task { await viewModel.load() }
            .overlay {
                ErrorBanner(message: viewModel.errorMessage)
            }
        }
    }
}
