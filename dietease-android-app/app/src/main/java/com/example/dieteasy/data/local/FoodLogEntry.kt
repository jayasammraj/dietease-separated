package com.example.dieteasy.data.local

/**
 * Simple food log entry — stored as JSON in SharedPreferences.
 * No Room/KSP needed.
 */
data class FoodLogEntry(
    val id: String = java.util.UUID.randomUUID().toString(),
    val name: String,
    val brand: String = "",
    val barcode: String = "",
    val calories: Int,
    val protein: Float = 0f,
    val carbs: Float = 0f,
    val fat: Float = 0f,
    val servings: Float = 1f,
    val loggedCalories: Int,
    val source: String = "",
    val loggedAt: Long = System.currentTimeMillis(),
    val dateKey: String  // "2026-06-12"
)
