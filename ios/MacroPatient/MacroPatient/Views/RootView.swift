import SwiftUI

struct RootView: View {
    @Bindable private var session = SessionManager.shared

    var body: some View {
        Group {
            if session.isLoadingSession {
                ProgressView("Loading…")
            } else if session.isAuthenticated {
                MainTabView()
            } else {
                LoginView()
            }
        }
        .task {
            await session.bootstrap()
        }
    }
}
