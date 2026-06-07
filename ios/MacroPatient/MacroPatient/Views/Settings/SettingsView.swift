import SwiftUI

struct SettingsView: View {
    @State private var apiBaseURL = APIConfig.baseURL.absoluteString
    @State private var savedMessage: String?

    var body: some View {
        Form {
            Section("API server") {
                TextField("Base URL", text: $apiBaseURL)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.URL)
                    .autocorrectionDisabled()
                Button("Save") {
                    guard let url = URL(string: apiBaseURL.trimmingCharacters(in: .whitespaces)) else {
                        savedMessage = "Invalid URL."
                        return
                    }
                    APIConfig.baseURL = url
                    savedMessage = "Saved. Restart requests use the new URL."
                }
                Text("Simulator default: http://127.0.0.1:5001/api\n(macOS blocks port 5000 for AirPlay.)\nDevice: use your Mac's LAN IP with the same port.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            if let savedMessage {
                Section {
                    Text(savedMessage)
                }
            }
        }
        .navigationTitle("Settings")
    }
}
