import SwiftUI

struct LoginView: View {
    @State private var viewModel = AuthViewModel()
    @State private var showRegister = false
    @Bindable private var session = SessionManager.shared

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Macro")
                            .font(.largeTitle.bold())
                        Text("Track nutrition and connect with your dietitian.")
                            .foregroundStyle(.secondary)
                    }
                    .padding(.top, 24)

                    ErrorBanner(message: viewModel.errorMessage)

                    TextField("Email", text: $viewModel.email)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                        .textContentType(.emailAddress)
                        .autocorrectionDisabled()
                        .textFieldStyle(.roundedBorder)

                    SecureField("Password", text: $viewModel.password)
                        .textContentType(.password)
                        .textFieldStyle(.roundedBorder)

                    Button {
                        Task { _ = await viewModel.login() }
                    } label: {
                        Text("Sign In")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(viewModel.isLoading)

                    Button("Create account") {
                        showRegister = true
                    }
                    .frame(maxWidth: .infinity)
                }
                .padding()
            }
            .navigationDestination(isPresented: $showRegister) {
                RegisterView()
            }
            .overlay { LoadingOverlay(isLoading: viewModel.isLoading) }
        }
    }
}
