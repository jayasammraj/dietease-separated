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
    private var currentEmail: String? = null

    // In-memory reactive state for Flow support
    private val _allEntries = MutableStateFlow<List<FoodLogEntry>>(emptyList())

    init {
        migrateOldData()
    }

    fun setCurrentUser(email: String?) {
        currentEmail = email
        _allEntries.value = loadAll()
    }

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

    private fun migrateOldData() {
        if (prefs.contains("entries")) {
            val oldEntries = prefs.getString("entries", null)
            if (oldEntries != null) {
                if (!prefs.contains("entries_guest@dietease.com")) {
                    prefs.edit()
                        .putString("entries_guest@dietease.com", oldEntries)
                        .remove("entries")
                        .apply()
                } else {
                    prefs.edit().remove("entries").apply()
                }
            }
        }
    }

    private fun loadAll(): List<FoodLogEntry> {
        val email = currentEmail ?: return emptyList()
        val json = prefs.getString("entries_$email", null) ?: return emptyList()
        return try {
            val type = object : TypeToken<List<FoodLogEntry>>() {}.type
            gson.fromJson(json, type) ?: emptyList()
        } catch (_: Exception) { emptyList() }
    }

    private fun saveAll(entries: List<FoodLogEntry>) {
        val email = currentEmail ?: return
        prefs.edit().putString("entries_$email", gson.toJson(entries)).apply()
    }
}

