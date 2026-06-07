import Foundation
import os.log

final class APIClient {
    static let shared = APIClient()

    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder
    private let keychain = KeychainService.shared
    private let logger = Logger(subsystem: "com.macro.patient", category: "API")

    var onUnauthorized: (() -> Void)?

    #if DEBUG
    var isLoggingEnabled = true
    #else
    var isLoggingEnabled = false
    #endif

    init(session: URLSession = .shared) {
        self.session = session
        self.decoder = JSONDecoder()
        self.decoder.dateDecodingStrategy = .custom(Self.decodeFlexibleDate)
        self.encoder = JSONEncoder()
        self.encoder.dateEncodingStrategy = .iso8601
    }

    func request<T: Decodable>(
        _ path: String,
        method: String = "GET",
        query: [String: String?] = [:],
        body: Encodable? = nil,
        auth: Bool = true
    ) async throws -> T {
        let data = try await requestData(path, method: method, query: query, body: body, auth: auth)
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            logDecodingFailure(path: path, data: data, error: error)
            throw APIError.decoding(error)
        }
    }

    func requestData(
        _ path: String,
        method: String = "GET",
        query: [String: String?] = [:],
        body: Encodable? = nil,
        auth: Bool = true
    ) async throws -> Data {
        guard let url = Self.buildURL(base: APIConfig.baseURL, path: path, query: query) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method.uppercased()
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        // Never send a stale token on public routes (login/register).
        if auth, let token = keychain.readToken(), !token.isEmpty {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try encoder.encode(AnyEncodable(body))
        }

        logRequest(request, body: body)

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw APIError.network(error)
        }

        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        logResponse(http, data: data, url: url)

        if http.statusCode == 401, auth {
            keychain.deleteToken()
            onUnauthorized?()
        }

        guard (200...299).contains(http.statusCode) else {
            throw APIError.from(
                statusCode: http.statusCode,
                payload: data,
                response: http,
                requestURL: url
            )
        }

        if data.isEmpty {
            return Data("{}".utf8)
        }

        return Self.unwrapSuccessEnvelopeIfNeeded(data)
    }

    func requestVoid(
        _ path: String,
        method: String = "DELETE",
        query: [String: String?] = [:],
        body: Encodable? = nil,
        auth: Bool = true
    ) async throws {
        _ = try await requestData(path, method: method, query: query, body: body, auth: auth)
    }

    /// Joins `http://host:port/api` + `auth/login` → `http://host:port/api/auth/login`
    static func buildURL(base: URL, path: String, query: [String: String?]) -> URL? {
        let normalizedBase = base.absoluteString.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let normalizedPath = path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        var urlString = normalizedBase
        if !normalizedPath.isEmpty {
            urlString += "/\(normalizedPath)"
        }

        guard var components = URLComponents(string: urlString) else {
            return nil
        }

        let queryItems = query.compactMap { key, value -> URLQueryItem? in
            guard let value else { return nil }
            return URLQueryItem(name: key, value: value)
        }
        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }

        return components.url
    }

    private static func unwrapSuccessEnvelopeIfNeeded(_ data: Data) -> Data {
        guard
            let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
            let success = json["success"] as? Bool,
            success,
            let inner = json["data"]
        else {
            return data
        }
        return (try? JSONSerialization.data(withJSONObject: inner)) ?? data
    }

    private func logRequest(_ request: URLRequest, body: Encodable?) {
        guard isLoggingEnabled else { return }
        let authHeader = request.value(forHTTPHeaderField: "Authorization")
        let authNote = authHeader == nil ? "none" : "Bearer ***"
        logger.debug("[\(request.httpMethod ?? "?", privacy: .public)] \(request.url?.absoluteString ?? "", privacy: .public) auth=\(authNote, privacy: .public)")
        if let body, let data = try? encoder.encode(AnyEncodable(body)),
           let json = String(data: data, encoding: .utf8) {
            logger.debug("body: \(json, privacy: .public)")
        }
    }

    private func logResponse(_ response: HTTPURLResponse, data: Data, url: URL) {
        guard isLoggingEnabled else { return }
        let body = String(data: data, encoding: .utf8) ?? "<empty>"
        let server = response.value(forHTTPHeaderField: "Server") ?? "unknown"
        logger.debug(
            "status=\(response.statusCode, privacy: .public) server=\(server, privacy: .public) url=\(url.absoluteString, privacy: .public) body=\(body, privacy: .public)"
        )
    }

    private func logDecodingFailure(path: String, data: Data, error: Error) {
        guard isLoggingEnabled else { return }
        let body = String(data: data, encoding: .utf8) ?? "<empty>"
        logger.error("decode failed path=\(path, privacy: .public) error=\(error.localizedDescription, privacy: .public) body=\(body, privacy: .public)")
    }

    private static func decodeFlexibleDate(_ decoder: Decoder) throws -> Date {
        let container = try decoder.singleValueContainer()
        if let string = try? container.decode(String.self) {
            let formatters: [ISO8601DateFormatter] = {
                let withFraction = ISO8601DateFormatter()
                withFraction.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
                let standard = ISO8601DateFormatter()
                standard.formatOptions = [.withInternetDateTime]
                return [withFraction, standard]
            }()
            for formatter in formatters {
                if let date = formatter.date(from: string) {
                    return date
                }
            }
            let dayOnly = DateFormatter()
            dayOnly.dateFormat = "yyyy-MM-dd"
            dayOnly.timeZone = TimeZone(secondsFromGMT: 0)
            if let date = dayOnly.date(from: string) {
                return date
            }
        }
        if let timestamp = try? container.decode(Double.self) {
            return Date(timeIntervalSince1970: timestamp / 1000)
        }
        throw DecodingError.dataCorruptedError(in: container, debugDescription: "Unsupported date format")
    }
}

private struct AnyEncodable: Encodable {
    private let encodeClosure: (Encoder) throws -> Void

    init(_ wrapped: Encodable) {
        self.encodeClosure = wrapped.encode
    }

    func encode(to encoder: Encoder) throws {
        try encodeClosure(encoder)
    }
}
