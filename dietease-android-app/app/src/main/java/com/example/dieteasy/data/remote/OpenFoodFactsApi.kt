package com.example.dieteasy.data.remote

import com.google.gson.annotations.SerializedName
import retrofit2.http.GET
import retrofit2.http.Path

// ── Open Food Facts API Response ─────────────────────────────────────────────
data class OFFResponse(
    val status: Int,
    val product: OFFProduct?
)

data class OFFProduct(
    @SerializedName("product_name")     val name: String?,
    @SerializedName("brands")           val brand: String?,
    @SerializedName("nutriments")       val nutriments: OFFNutriments?,
    @SerializedName("image_url")        val imageUrl: String?
)

data class OFFNutriments(
    @SerializedName("energy-kcal_100g")   val calories: Float?,
    @SerializedName("proteins_100g")      val protein: Float?,
    @SerializedName("carbohydrates_100g") val carbs: Float?,
    @SerializedName("fat_100g")           val fat: Float?
)

// ── Retrofit interface ────────────────────────────────────────────────────────
interface OpenFoodFactsApi {
    @GET("api/v0/product/{barcode}.json")
    suspend fun getProduct(@Path("barcode") barcode: String): OFFResponse
}
