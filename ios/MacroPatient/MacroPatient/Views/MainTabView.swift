import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            DashboardView()
                .tabItem { Label("Home", systemImage: "house.fill") }

            MealsView()
                .tabItem { Label("Meals", systemImage: "fork.knife") }

            IoTView()
                .tabItem { Label("Activity", systemImage: "figure.walk") }

            RecommendationsView()
                .tabItem { Label("Tips", systemImage: "lightbulb.fill") }

            MoreView()
                .tabItem { Label("More", systemImage: "ellipsis.circle.fill") }
        }
    }
}

struct MoreView: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationLink { ProfileView() } label: {
                    Label("Profile", systemImage: "person.circle")
                }
                NavigationLink { DietitianView() } label: {
                    Label("Dietitian", systemImage: "stethoscope")
                }
                NavigationLink { ReportsView() } label: {
                    Label("Reports", systemImage: "doc.text")
                }
                NavigationLink { SettingsView() } label: {
                    Label("Settings", systemImage: "gearshape")
                }
            }
            .navigationTitle("More")
        }
    }
}
