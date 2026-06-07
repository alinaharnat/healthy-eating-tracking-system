import SwiftUI

struct DashboardView: View {
    @State private var viewModel = DashboardViewModel()
    @Bindable private var session = SessionManager.shared

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    if let user = session.currentUser {
                        Text("Hello, \(user.name)")
                            .font(.title2.bold())
                    }

                    ErrorBanner(message: viewModel.errorMessage)

                    if let overview = viewModel.overview {
                        nutritionCard(overview.dailyNutrition, title: "Today")
                        activityCard(overview.activity)
                        nutritionPeriodCard(overview.weeklyNutrition, title: "This week")
                    } else if !viewModel.isLoading {
                        EmptyStateView(title: "No analytics yet", systemImage: "chart.bar")
                    }
                }
                .padding()
            }
            .navigationTitle("Dashboard")
            .refreshable { await viewModel.load() }
            .task { await viewModel.load() }
            .overlay { LoadingOverlay(isLoading: viewModel.isLoading && viewModel.overview == nil) }
        }
    }

    private func nutritionCard(_ summary: DailyNutritionSummary, title: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            HStack {
                metric("Calories", value: Int(summary.totals.calories), suffix: "kcal")
                if let goal = summary.goal {
                    metric("Goal", value: Int(goal), suffix: "kcal")
                }
            }
            Text(summary.status.capitalized)
                .font(.caption)
                .foregroundStyle(.secondary)
            macroRow(summary.totals)
        }
        .cardStyle()
    }

    private func nutritionPeriodCard(_ period: PeriodAnalytics, title: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            metric("Avg calories", value: Int(period.averageCalories), suffix: "kcal")
            Text("\(period.days.count) days tracked")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .cardStyle()
    }

    private func activityCard(_ activity: ActivitySummary) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Activity (\(activity.period))").font(.headline)
            HStack {
                metric("Steps", value: activity.totalSteps)
                metric("Burned", value: Int(activity.burnedCalories), suffix: "kcal")
            }
            if let weight = activity.lastWeight {
                Text(String(format: "Last weight: %.1f kg", weight))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .cardStyle()
    }

    private func metric(_ label: String, value: Int, suffix: String = "") -> some View {
        VStack(alignment: .leading) {
            Text(label).font(.caption).foregroundStyle(.secondary)
            Text("\(value) \(suffix)".trimmingCharacters(in: .whitespaces))
                .font(.title3.bold())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func macroRow(_ totals: NutritionTotals) -> some View {
        HStack {
            Text("P \(Int(totals.proteins))g")
            Text("F \(Int(totals.fats))g")
            Text("C \(Int(totals.carbs))g")
        }
        .font(.caption)
        .foregroundStyle(.secondary)
    }
}

private extension View {
    func cardStyle() -> some View {
        self
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 14))
    }
}
