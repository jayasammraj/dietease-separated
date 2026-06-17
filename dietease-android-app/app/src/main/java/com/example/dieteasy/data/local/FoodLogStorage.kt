package com.example.dieteasy.data.local

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.map

/**
 * SharedPreferences + Gson storage — replaces Room.
 * Stores the entire log as a JSON list per day key.
 */
class FoodLogStorage(context: Context) {

    private val prefs = context.getSharedPreferences("dietease_log", Context.MODE_PRIVATE)
    private val gson  = Gson()

    // In-memory reactive state for Flow support
    private val _allEntries = MutableStateFlow(loadAll())

    // ── Public Flows ──────────────────────────────────────────────────────────

    fun getLogForDate(date: String): Flow<List<FoodLogEntry>> =
        _allEntries.map { entries -> entries.filter { it.dateKey == date }.sortedByDescending { it.loggedAt } }

    fun getAllDates(): Flow<List<String>> =
        _allEntries.map { entries -> entries.map { it.dateKey }.distinct().sortedDescending() }

    // ── Write operations ──────────────────────────────────────────────────────

    fun insertEntry(entry: FoodLogEntry) {
        val all = loadAll().toMutableList()
        all.add(entry)
        saveAll(all)
        _allEntries.value = all
    }

    fun deleteById(id: String) {
        val all = loadAll().filter { it.id != id }
        saveAll(all)
        _allEntries.value = all
    }

    fun getAllEntries(): List<FoodLogEntry> = _allEntries.value

    // ── Private helpers ───────────────────────────────────────────────────────

    private fun loadAll(): List<FoodLogEntry> {
        val json = prefs.getString("entries", null) ?: return emptyList()
        return try {
            val type = object : TypeToken<List<FoodLogEntry>>() {}.type
            gson.fromJson(json, type) ?: emptyList()
        } catch (_: Exception) { emptyList() }
    }

    private fun saveAll(entries: List<FoodLogEntry>) {
        prefs.edit().putString("entries", gson.toJson(entries)).apply()
    }
}
