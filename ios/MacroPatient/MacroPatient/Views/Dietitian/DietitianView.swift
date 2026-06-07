import SwiftUI

struct DietitianView: View {
    @State private var viewModel = DietitianViewModel()
    @Bindable private var session = SessionManager.shared

    var body: some View {
        NavigationStack {
            List {
                if session.currentUser?.dietitian != nil {
                    Section("Your dietitian") {
                        if let dietitian = session.currentUser?.dietitian {
                            Text(dietitian.name).font(.headline)
                            Text(dietitian.email).font(.subheadline).foregroundStyle(.secondary)
                        }
                    }
                } else {
                    Section("Request a dietitian") {
                        Picker("Dietitian", selection: $viewModel.selectedDietitianId) {
                            Text("Select…").tag(Optional<String>.none)
                            ForEach(viewModel.dietitians) { dietitian in
                                Text(dietitian.name).tag(Optional(dietitian.id))
                            }
                        }
                        TextField("Message (optional)", text: $viewModel.requestMessage, axis: .vertical)
                            .lineLimit(2...4)
                        Button("Send request") {
                            Task { await viewModel.submitRequest() }
                        }
                        .disabled(viewModel.isSubmitting)
                    }
                }

                Section("Your requests") {
                    if viewModel.outgoingRequests.isEmpty {
                        Text("No requests yet.").foregroundStyle(.secondary)
                    }
                    ForEach(viewModel.outgoingRequests) { request in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(request.dietitian?.name ?? "Dietitian")
                                .font(.headline)
                            Text(request.status.capitalized)
                                .font(.caption)
                                .foregroundStyle(statusColor(request.status))
                            if let message = request.message, !message.isEmpty {
                                Text(message).font(.footnote)
                            }
                        }
                        .swipeActions {
                            if request.status == "pending" {
                                Button(role: .destructive) {
                                    Task { await viewModel.cancelRequest(request) }
                                } label: {
                                    Label("Cancel", systemImage: "xmark")
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Dietitian")
            .refreshable { await viewModel.load() }
            .task { await viewModel.load() }
            .overlay {
                VStack {
                    ErrorBanner(message: viewModel.errorMessage)
                    if let success = viewModel.successMessage {
                        Text(success)
                            .font(.footnote)
                            .foregroundStyle(.green)
                            .padding(.horizontal)
                    }
                    Spacer()
                }
            }
        }
    }

    private func statusColor(_ status: String) -> Color {
        switch status.lowercased() {
        case "accepted": return .green
        case "pending": return .orange
        case "rejected", "cancelled", "canceled": return .red
        default: return .secondary
        }
    }
}
