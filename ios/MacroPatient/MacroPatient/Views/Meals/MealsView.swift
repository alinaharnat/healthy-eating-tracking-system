import SwiftUI

struct MealsView: View {
    @State private var viewModel = MealsViewModel()
    @State private var showAddMeal = false

    var body: some View {
        NavigationStack {
            List {
                Section {
                    DatePicker("Date", selection: $viewModel.selectedDate, displayedComponents: .date)
                        .onChange(of: viewModel.selectedDate) { _, _ in
                            Task { await viewModel.load() }
                        }
                }

                if let summary = viewModel.dailySummary {
                    Section("Daily summary") {
                        LabeledContent("Calories", value: "\(Int(summary.totals.calories)) kcal")
                        LabeledContent("Status", value: summary.status)
                    }
                }

                Section("Meals") {
                    if viewModel.meals.isEmpty && !viewModel.isLoading {
                        Text("No meals logged for this day.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(viewModel.meals) { meal in
                        NavigationLink {
                            MealDetailView(meal: meal)
                        } label: {
                            MealRowView(meal: meal)
                        }
                        .swipeActions {
                            Button(role: .destructive) {
                                Task { await viewModel.deleteMeal(meal) }
                            } label: {
                                Label("Delete", systemImage: "trash")
                            }
                        }
                    }
                }
            }
            .navigationTitle("Meals")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showAddMeal = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddMeal) {
                AddMealView(date: viewModel.selectedDate) {
                    Task { await viewModel.load() }
                }
            }
            .refreshable { await viewModel.load() }
            .task { await viewModel.load() }
            .overlay {
                if let error = viewModel.errorMessage {
                    ErrorBanner(message: error)
                }
            }
        }
    }
}

struct MealRowView: View {
    let meal: Meal

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(meal.mealType.displayName).font(.headline)
            Text("\(meal.mealProducts.count) items · \(Int(meal.totalCalories)) kcal")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 4)
    }
}

struct MealDetailView: View {
    let meal: Meal

    var body: some View {
        List {
            Section {
                LabeledContent("Type", value: meal.mealType.displayName)
                LabeledContent("Calories", value: "\(Int(meal.totalCalories)) kcal")
            }
            Section("Items") {
                ForEach(meal.mealProducts) { item in
                    VStack(alignment: .leading) {
                        Text(item.displayName)
                        Text("\(Int(item.weightGrams))g · \(Int(item.calories)) kcal")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
        .navigationTitle("Meal")
    }
}
