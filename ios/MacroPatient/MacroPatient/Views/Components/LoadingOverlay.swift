import SwiftUI

struct LoadingOverlay: View {
    let isLoading: Bool

    var body: some View {
        if isLoading {
            ZStack {
                Color.black.opacity(0.15).ignoresSafeArea()
                ProgressView()
                    .controlSize(.large)
                    .padding(24)
                    .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
            }
        }
    }
}

struct ErrorBanner: View {
    let message: String?

    var body: some View {
        if let message, !message.isEmpty {
            Text(message)
                .font(.footnote)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(12)
                .background(Color.red.opacity(0.9), in: RoundedRectangle(cornerRadius: 10))
                .padding(.horizontal)
        }
    }
}

struct EmptyStateView: View {
    let title: String
    let systemImage: String

    var body: some View {
        ContentUnavailableView(title, systemImage: systemImage, description: Text("Nothing here yet."))
    }
}
