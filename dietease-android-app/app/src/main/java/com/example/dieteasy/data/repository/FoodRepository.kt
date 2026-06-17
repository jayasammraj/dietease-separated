package com.example.dieteasy.data.repository

import android.content.Context
import com.example.dieteasy.data.local.FoodLogEntry
import com.example.dieteasy.data.local.FoodLogStorage
import com.example.dieteasy.data.remote.OFFProduct
import com.example.dieteasy.data.remote.OpenFoodFactsApi
import kotlinx.coroutines.flow.Flow
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.time.LocalDate

// ── Food item model ───────────────────────────────────────────────────────────
data class FoodItem(
    val name: String,
    val brand: String = "",
    val barcode: String = "",
    val calories: Int,
    val protein: Float = 0f,
    val carbs: Float = 0f,
    val fat: Float = 0f,
    val source: String = ""
)

// ── Built-in Indian product database ─────────────────────────────────────────
val BUILTIN_PRODUCTS = mapOf(
    "8901719100018" to FoodItem("Parle-G Biscuits",      "Parle",      "8901719100018", 450, 6.7f, 76f, 11.7f, "Built-in DB"),
    "8901719110017" to FoodItem("Parle Hide & Seek",      "Parle",      "8901719110017", 496, 6.2f, 66f, 23f,   "Built-in DB"),
    "8901063032019" to FoodItem("Britannia Good Day",     "Britannia",  "8901063032019", 503, 7f,   64f, 24f,   "Built-in DB"),
    "8901030810054" to FoodItem("Parle-G Gold",           "Parle",      "8901030810054", 450, 6.7f, 76f, 11.7f, "Built-in DB"),
    "8901088002230" to FoodItem("Amul Butter",            "Amul",       "8901088002230", 720, 0.5f, 0f,  80f,   "Built-in DB"),
    "8901058200401" to FoodItem("Amul Taaza Milk",        "Amul",       "8901058200401", 62,  3.2f, 4.7f,3.2f,  "Built-in DB"),
    "8904004400019" to FoodItem("Sunfeast Dark Fantasy",  "ITC",        "8904004400019", 517, 6.5f, 64f, 26f,   "Built-in DB"),
    "8901499000018" to FoodItem("Kellogg's Cornflakes",   "Kellogg's",  "8901499000018", 357, 8f,   79f, 1f,    "Built-in DB"),
    "7622210449283" to FoodItem("Cadbury Dairy Milk",     "Cadbury",    "7622210449283", 534, 7.7f, 57.6f,29.7f,"Built-in DB"),
    "7622210979063" to FoodItem("Cadbury 5 Star",         "Cadbury",    "7622210979063", 462, 4f,   70f, 18f,   "Built-in DB"),
    "8901058501203" to FoodItem("KitKat 4 Finger",        "Nestlé",     "8901058501203", 518, 6.3f, 63f, 27f,   "Built-in DB"),
    "8901552004123" to FoodItem("Coca-Cola 250ml",        "Coca-Cola",  "8901552004123", 44,  0f,   11f, 0f,    "Built-in DB"),
    "8901012000016" to FoodItem("Pepsi 250ml",            "PepsiCo",    "8901012000016", 42,  0f,   10.6f,0f,   "Built-in DB"),
    "049000050103"  to FoodItem("Coca-Cola Classic",      "Coca-Cola",  "049000050103",  42,  0f,   10.6f,0f,   "Built-in DB"),
    "038000845321"  to FoodItem("Kellogg's Corn Flakes",  "Kellogg's",  "038000845321",  357, 8f,   79f, 0.5f,  "Built-in DB"),
    "037600164801"  to FoodItem("Oreo Cookies",           "Nabisco",    "037600164801",  471, 5f,   70f, 20f,   "Built-in DB"),
)

// ── Repository ────────────────────────────────────────────────────────────────
class FoodRepository(context: Context) {

    private val storage = FoodLogStorage(context)

    private val api: OpenFoodFactsApi by lazy {
        Retrofit.Builder()
            .baseUrl("https://world.openfoodfacts.org/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(OpenFoodFactsApi::class.java)
    }

    fun todayKey(): String = LocalDate.now().toString()

    // ── Barcode lookup ────────────────────────────────────────────────────────
    suspend fun lookupBarcode(barcode: String): Result<FoodItem> {
        BUILTIN_PRODUCTS[barcode]?.let { return Result.success(it) }
        return try {
            val resp = api.getProduct(barcode)
            if (resp.status == 1 && resp.product != null)
                Result.success(resp.product.toFoodItem(barcode))
            else
                Result.failure(Exception("Not found"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ── Log access ────────────────────────────────────────────────────────────
    fun getTodayLog(): Flow<List<FoodLogEntry>> = storage.getLogForDate(todayKey())
    fun getLogForDate(date: String): Flow<List<FoodLogEntry>> = storage.getLogForDate(date)
    fun getAllDates(): Flow<List<String>> = storage.getAllDates()

    fun logFood(item: FoodItem, servings: Float) {
        storage.insertEntry(
            FoodLogEntry(
                name           = item.name,
                brand          = item.brand,
                barcode        = item.barcode,
                calories       = item.calories,
                protein        = item.protein,
                carbs          = item.carbs,
                fat            = item.fat,
                servings       = servings,
                loggedCalories = (item.calories * servings).toInt(),
                source         = item.source,
                dateKey        = todayKey()
            )
        )
    }

    fun deleteEntry(id: String) = storage.deleteById(id)

    fun getAllProducts(): List<FoodItem> = BUILTIN_PRODUCTS.values.toList()

    private fun OFFProduct.toFoodItem(barcode: String) = FoodItem(
        name     = name?.ifBlank { "Unknown" } ?: "Unknown",
        brand    = brand?.split(",")?.firstOrNull()?.trim() ?: "",
        barcode  = barcode,
        calories = nutriments?.calories?.toInt() ?: 0,
        protein  = nutriments?.protein ?: 0f,
        carbs    = nutriments?.carbs ?: 0f,
        fat      = nutriments?.fat ?: 0f,
        source   = "Open Food Facts"
    )
}
