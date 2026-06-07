import Foundation
import Security

final class KeychainService {
    static let shared = KeychainService()

    private let service = "com.macro.patient"
    private let tokenAccount = "authToken"
    private let userIdAccount = "userId"

    private init() {}

    func saveToken(_ token: String, userId: String?) {
        save(token, account: tokenAccount)
        if let userId {
            save(userId, account: userIdAccount)
        }
    }

    func readToken() -> String? {
        read(account: tokenAccount)
    }

    func readUserId() -> String? {
        read(account: userIdAccount)
    }

    func deleteToken() {
        delete(account: tokenAccount)
        delete(account: userIdAccount)
    }

    private func save(_ value: String, account: String) {
        delete(account: account)
        let data = Data(value.utf8)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]
        SecItemAdd(query as CFDictionary, nil)
    }

    private func read(account: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess, let data = item as? Data else {
            return nil
        }
        return String(data: data, encoding: .utf8)
    }

    private func delete(account: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
        SecItemDelete(query as CFDictionary)
    }
}
