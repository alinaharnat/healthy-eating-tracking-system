import SwiftUI

struct IoTView: View {
    @State private var viewModel = IoTViewModel()

    var body: some View {
        NavigationStack {
            List {
                if let activity = viewModel.activity {
                    Section("Weekly activity") {
                        LabeledContent("Steps", value: "\(activity.totalSteps)")
                        LabeledContent("Burned", value: "\(Int(activity.burnedCalories)) kcal")
                        if let weight = activity.lastWeight {
                            LabeledContent("Last weight", value: String(format: "%.1f kg", weight))
                        }
                    }
                }

                Section("Log measurement") {
                    TextField("Pulse (bpm)", text: $viewModel.pulseText)
                        .keyboardType(.numberPad)
                    TextField("Steps", text: $viewModel.stepsText)
                        .keyboardType(.numberPad)
                    TextField("Weight (kg)", text: $viewModel.weightText)
                        .keyboardType(.decimalPad)
                    Button("Save") {
                        Task { await viewModel.logMeasurement() }
                    }
                    .disabled(viewModel.isSaving)
                }

                Section("Recent measurements") {
                    if viewModel.measurements.isEmpty && !viewModel.isLoading {
                        Text("No measurements yet.").foregroundStyle(.secondary)
                    }
                    ForEach(viewModel.measurements) { item in
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                if let pulse = item.pulse {
                                    Text("Pulse \(pulse)")
                                }
                                if let steps = item.steps {
                                    Text("Steps \(steps)")
                                }
                                if let weight = item.weight {
                                    Text(String(format: "%.1f kg", weight))
                                }
                            }
                            .font(.subheadline)
                            if let date = item.timestamp ?? item.createdAt {
                                Text(date.formatted(date: .abbreviated, time: .shortened))
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Activity")
            .refreshable { await viewModel.load() }
            .task { await viewModel.load() }
            .overlay { ErrorBanner(message: viewModel.errorMessage) }
        }
    }
}
