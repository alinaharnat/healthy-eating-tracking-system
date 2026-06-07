import SwiftUI

struct AddMealView: View {
    let date: Date
    let onSaved: () -> Void

    @State private var viewModel = AddMealViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section("Meal") {
                    Picker("Type", selection: $viewModel.mealType) {
                        ForEach(MealType.allCases) { type in
                            Text(type.displayName).tag(type)
                        }
                    }
                }

                Section("Search products") {
                    HStack {
                        TextField("e.g. apple", text: $viewModel.searchQuery)
                            .onSubmit { Task { await viewModel.search() } }
                        Button("Search") {
                            Task { await viewModel.search() }
                        }
                    }
                    if viewModel.isSearching {
                        ProgressView()
                    }
                    ForEach(viewModel.searchResults) { product in
                        Button {
                            viewModel.addProduct(product)
                        } label: {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(product.name)
                                    Text("\(Int(product.calories)) kcal / 100g")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                                Spacer()
                                Image(systemName: "plus.circle")
                            }
                        }
                    }
                }

                Section("Selected") {
                    if viewModel.selectedProducts.isEmpty {
                        Text("No products added.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach($viewModel.selectedProducts) { $item in
                        Stepper(
                            "\(item.product.name) · \(Int(item.grams))g",
                            value: $item.grams,
                            in: 10...1000,
                            step: 10
                        )
                    }
                }

                if let error = viewModel.errorMessage {
                    Section {
                        Text(error).foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Log meal")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task {
                            if await viewModel.save(for: date) {
                                onSaved()
                                dismiss()
                            }
                        }
                    }
                    .disabled(viewModel.isSaving)
                }
            }
        }
    }
}
