import Foundation

enum APIConfig {
    private static let baseURLKey = "macro.api.baseURL"

    /// Default targets the Macro backend on the simulator host.
    static var baseURL: URL {
        get {
            if let stored = UserDefaults.standard.string(forKey: baseURLKey),
               let url = URL(string: stored) {
                return url
            }
            // Port 5001: macOS AirPlay Receiver occupies 5000 and returns HTTP 403.
            return URL(string: "http://127.0.0.1:5001/api")!
        }
        set {
            var normalized = newValue.absoluteString
            while normalized.hasSuffix("/") {
                normalized.removeLast()
            }
            UserDefaults.standard.set(normalized, forKey: baseURLKey)
        }
    }
}
