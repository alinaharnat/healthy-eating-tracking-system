import SwiftUI

struct ProfileView: View {
    @State private var viewModel = ProfileViewModel()
    @Bindable private var session = SessionManager.shared

    var body: some View {
        NavigationStack {
            Form {
                if let user = session.currentUser {
                    Section("Account") {
                        LabeledContent("Email", value: user.email)
                        if let dietitian = user.dietitian {
                            LabeledContent("Dietitian", value: dietitian.name)
                        }
                    }
                }

                Section("Profile") {
                    TextField("Name", text: $viewModel.name)
                    TextField("Age", text: $viewModel.age)
                        .keyboardType(.numberPad)
                    TextField("Height (cm)", text: $viewModel.height)
                        .keyboardType(.decimalPad)
                    TextField("Weight (kg)", text: $viewModel.weight)
                        .keyboardType(.decimalPad)
                    Picker("Goal", selection: $viewModel.goalType) {
                        ForEach(GoalType.allCases) { goal in
                            Text(goal.displayName).tag(goal)
                        }
                    }
                    TextField("Daily calorie goal", text: $viewModel.dailyCalorieGoal)
                        .keyboardType(.numberPad)
                    Picker("Language", selection: $viewModel.language) {
                        Text("English").tag("en")
                        Text("Ukrainian").tag("ua")
                    }
                }

                if let error = viewModel.errorMessage {
                    Section { Text(error).foregroundStyle(.red) }
                }
                if let success = viewModel.successMessage {
                    Section { Text(success).foregroundStyle(.green) }
                }

                Section {
                    Button("Save changes") {
                        Task { await viewModel.save() }
                    }
                    .disabled(viewModel.isSaving)

                    Button("Sign out", role: .destructive) {
                        session.signOut()
                    }
                }
            }
            .navigationTitle("Profile")
            .onAppear { viewModel.loadFromSession() }
            .overlay { LoadingOverlay(isLoading: viewModel.isSaving) }
        }
    }
}
