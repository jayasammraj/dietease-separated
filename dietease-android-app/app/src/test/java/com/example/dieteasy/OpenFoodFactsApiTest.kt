package com.example.dieteasy

import com.example.dieteasy.data.remote.OFFNutriments
import com.example.dieteasy.data.remote.OFFResponse
import com.google.gson.Gson
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

class OpenFoodFactsApiTest {

    private val gson = Gson()

    @Test
    fun testStandard100gKeysDeserialization() {
        val json = """
            {
                "status": 1,
                "product": {
                    "product_name": "Parle-G",
                    "brands": "Parle",
                    "nutriments": {
                        "energy-kcal_100g": 450.0,
                        "energy_100g": 1883.0,
                        "proteins_100g": 6.7,
                        "carbohydrates_100g": 76.0,
                        "fat_100g": 11.7
                    }
                }
            }
        """.trimIndent()

        val response = gson.fromJson(json, OFFResponse::class.java)
        assertNotNull(response)
        assertEquals(1, response.status)
        assertNotNull(response.product)
        val nutriments = response.product?.nutriments
        assertNotNull(nutriments)
        assertEquals(450.0f, nutriments?.calories)
        assertEquals(1883.0f, nutriments?.energyKj)
        assertEquals(6.7f, nutriments?.protein)
        assertEquals(76.0f, nutriments?.carbs)
        assertEquals(11.7f, nutriments?.fat)
    }

    @Test
    fun testBaseKeysDeserializationFallback() {
        val json = """
            {
                "status": 1,
                "product": {
                    "product_name": "Original Taste",
                    "brands": "Coca-Cola",
                    "nutriments": {
                        "energy-kcal": 42.0,
                        "energy": 180.0,
                        "proteins": 0.0,
                        "carbohydrates": 10.6,
                        "fat": 0.0
                    }
                }
            }
        """.trimIndent()

        val response = gson.fromJson(json, OFFResponse::class.java)
        assertNotNull(response)
        val nutriments = response.product?.nutriments
        assertNotNull(nutriments)
        assertEquals(42.0f, nutriments?.calories)
        assertEquals(180.0f, nutriments?.energyKj)
        assertEquals(0.0f, nutriments?.protein)
        assertEquals(10.6f, nutriments?.carbs)
        assertEquals(0.0f, nutriments?.fat)
    }

    @Test
    fun testServingKeysDeserializationFallback() {
        val json = """
            {
                "status": 1,
                "product": {
                    "product_name": "Cookie",
                    "brands": "Oreo",
                    "nutriments": {
                        "energy-kcal_serving": 140.0,
                        "energy-kj_serving": 585.0,
                        "proteins_serving": 2.0,
                        "carbohydrates_serving": 21.0,
                        "fat_serving": 6.0
                    }
                }
            }
        """.trimIndent()

        val response = gson.fromJson(json, OFFResponse::class.java)
        assertNotNull(response)
        val nutriments = response.product?.nutriments
        assertNotNull(nutriments)
        assertEquals(140.0f, nutriments?.calories)
        assertEquals(585.0f, nutriments?.energyKj)
        assertEquals(2.0f, nutriments?.protein)
        assertEquals(21.0f, nutriments?.carbs)
        assertEquals(6.0f, nutriments?.fat)
    }
}
