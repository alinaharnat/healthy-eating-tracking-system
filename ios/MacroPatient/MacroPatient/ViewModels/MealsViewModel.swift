import Foundation
import Observation

@MainActor
@Observable
final class MealsViewModel {
    var selectedDate = Date()
    var meals: [Meal] = []
    var dailySummary: DailyNutritionSummary?
    var isLoading = false
    var errorMessage: String?

    private let mealService = MealService()
    private let analyticsService = AnalyticsService()

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            async let mealsTask = mealService.meals(for: selectedDate)
            async let summaryTask = analyticsService.dailySummary(date: selectedDate)
            meals = try await mealsTask
            dailySummary = try await summaryTask
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func deleteMeal(_ meal: Meal) async {
        do {
            try await mealService.deleteMeal(id: meal.id)
            await load()
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}

struct SelectedMealProduct: Identifiable {
    let id: String
    let product: Product
    var grams: Double

    init(product: Product, grams: Double = 100) {
        self.id = product.id
        self.product = product
        self.grams = grams
    }
}

@MainActor
@Observable
final class AddMealViewModel {
    var mealType: MealType = .lunch
    var selectedProducts: [SelectedMealProduct] = []
    var searchQuery = ""
    var searchResults: [Product] = []
    var isSearching = false
    var isSaving = false
    var errorMessage: String?

    private let productService = ProductService()
    private let mealService = MealService()

    func search() async {
        let query = searchQuery.trimmingCharacters(in: .whitespaces)
        guard !query.isEmpty else {
            searchResults = []
            return
        }
        isSearching = true
        defer { isSearching = false }
        do {
            searchResults = try await productService.search(query: query)
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func addProduct(_ product: Product, grams: Double = 100) {
        selectedProducts.append(SelectedMealProduct(product: product, grams: grams))
        searchQuery = ""
        searchResults = []
    }

    func save(for date: Date) async -> Bool {
        guard !selectedProducts.isEmpty else {
            errorMessage = "Add at least one product."
            return false
        }
        isSaving = true
        errorMessage = nil
        defer { isSaving = false }

        let items = selectedProducts.map { item in
            MealProductInput(productId: item.product.id, customProduct: nil, weightGrams: item.grams)
        }
        let request = CreateMealRequest(date: date, mealType: mealType, mealProducts: items)

        do {
            _ = try await mealService.createMeal(request)
            return true
        } catch {
            errorMessage = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
            return false
        }
    }
}
