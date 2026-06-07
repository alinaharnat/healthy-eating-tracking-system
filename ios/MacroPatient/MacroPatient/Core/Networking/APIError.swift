import Foundation

struct APIErrorResponse: Decodable {
    let message: String?
    let success: Bool?
}

enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case unauthorized(String)
    case forbidden(String)
    case notFound(String)
    case conflict(String)
    case validation(String)
    case server(String)
    case wrongServer(String)
    case decoding(Error)
    case network(Error)
    case unknown(Int, String)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid request URL."
        case .invalidResponse:
            return "Invalid server response."
        case .unauthorized(let message),
             .forbidden(let message),
             .notFound(let message),
             .conflict(let message),
             .validation(let message),
             .server(let message),
             .wrongServer(let message):
            return message
        case .decoding(let error):
            return "Failed to parse response: \(error.localizedDescription)"
        case .network(let error):
            return error.localizedDescription
        case .unknown(let code, let message):
            return "Error \(code): \(message)"
        }
    }

    static func from(
        statusCode: Int,
        payload: Data?,
        response: HTTPURLResponse? = nil,
        requestURL: URL? = nil
    ) -> APIError {
        let parsed = parseMessage(from: payload)
        let message = parsed ?? HTTPURLResponse.localizedString(forStatusCode: statusCode)

        if statusCode == 403,
           let hint = wrongServerHint(
               statusCode: statusCode,
               payload: payload,
               serverHeader: response?.value(forHTTPHeaderField: "Server"),
               requestURL: requestURL
           ) {
            return .wrongServer(hint)
        }

        switch statusCode {
        case 400:
            return .validation(message)
        case 401:
            return .unauthorized(message)
        case 403:
            return .forbidden(message)
        case 404:
            return .notFound(message)
        case 409:
            return .conflict(message)
        case 500...599:
            return .server(message)
        default:
            return .unknown(statusCode, message)
        }
    }

    /// Detects macOS AirPlay on port 5000 (empty 403, Server: AirTunes).
    private static func wrongServerHint(
        statusCode: Int,
        payload: Data?,
        serverHeader: String?,
        requestURL: URL?
    ) -> String? {
        guard statusCode == 403 else { return nil }

        let bodyEmpty = payload == nil || payload?.isEmpty == true
        let isAirTunes = serverHeader?.localizedCaseInsensitiveContains("AirTunes") == true
            || serverHeader?.localizedCaseInsensitiveContains("AirPlay") == true

        if isAirTunes || (bodyEmpty && requestURL?.port == 5000) {
            return """
            Could not reach the Macro API (HTTP 403). Port 5000 is used by macOS AirPlay Receiver, not the backend.
            Start the API with PORT=5001 (default) and set the app base URL to http://127.0.0.1:5001/api in Settings.
            """
        }

        if bodyEmpty {
            return """
            HTTP 403 with an empty body — the request likely did not reach the Macro API. \
            Check that the backend is running and the base URL in Settings includes /api (e.g. http://127.0.0.1:5001/api).
            """
        }

        return nil
    }

    private static func parseMessage(from data: Data?) -> String? {
        guard let data, !data.isEmpty else { return nil }
        if let decoded = try? JSONDecoder().decode(APIErrorResponse.self, from: data),
           let message = decoded.message, !message.isEmpty {
            return message
        }
        if let text = String(data: data, encoding: .utf8), !text.isEmpty {
            return text
        }
        return nil
    }
}
