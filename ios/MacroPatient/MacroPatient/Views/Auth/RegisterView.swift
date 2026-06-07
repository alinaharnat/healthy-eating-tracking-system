import SwiftUI

struct RegisterView: View {
    @State private var viewModel = AuthViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        Form {
            Section("Account") {
                TextField("Full name", text: $viewModel.name)
                TextField("Email", text: $viewModel.email)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                SecureField("Password (min 6)", text: $viewModel.password)
            }

            if let error = viewModel.errorMessage {
                Section {
                    Text(error).foregroundStyle(.red)
                }
            }

            Section {
                Button("Register as patient") {
                    Task {
                        if await viewModel.register() {
                            dismiss()
                        }
                    }
                }
                .disabled(viewModel.isLoading)
            }
        }
        .navigationTitle("Register")
        .overlay { LoadingOverlay(isLoading: viewModel.isLoading) }
    }
}
