package com.example.dieteasy.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.dieteasy.data.local.FoodLogEntry
import com.example.dieteasy.data.repository.FoodItem
import com.example.dieteasy.data.repository.FoodRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

sealed class LookupState {
    object Idle     : LookupState()
    object Loading  : LookupState()
    data class Success(val item: FoodItem) : LookupState()
    data class Error(val message: String)  : LookupState()
    object NotFound : LookupState()
}

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val repo  = FoodRepository(application)
    private val prefs = application.getSharedPreferences("dietease_prefs", 0)

    // ── Daily goal ────────────────────────────────────────────────────────────
    private val _dailyGoal = MutableStateFlow(prefs.getInt("daily_goal", 2000))
    val dailyGoal: StateFlow<Int> = _dailyGoal.asStateFlow()

    // ── Today's log ───────────────────────────────────────────────────────────
    val todayLog: StateFlow<List<FoodLogEntry>> = repo.getTodayLog()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val totalCalories: StateFlow<Int> = todayLog.map { it.sumOf { e -> e.loggedCalories } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // ── History ───────────────────────────────────────────────────────────────
    val historyDates: StateFlow<List<String>> = repo.getAllDates()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _selectedDate = MutableStateFlow(repo.todayKey())
    val selectedDate: StateFlow<String> = _selectedDate.asStateFlow()

    val selectedDateLog: StateFlow<List<FoodLogEntry>> = _selectedDate.flatMapLatest { date ->
        repo.getLogForDate(date)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // ── Lookup ────────────────────────────────────────────────────────────────
    private val _lookupState = MutableStateFlow<LookupState>(LookupState.Idle)
    val lookupState: StateFlow<LookupState> = _lookupState.asStateFlow()

    private val _servings = MutableStateFlow(1f)
    val servings: StateFlow<Float> = _servings.asStateFlow()

    private val _scannedBarcode = MutableStateFlow("")

    private val _showManualEntry = MutableStateFlow(false)
    val showManualEntry: StateFlow<Boolean> = _showManualEntry.asStateFlow()

    // ── Products search ───────────────────────────────────────────────────────
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    val filteredProducts = _searchQuery.map { q ->
        if (q.isBlank()) repo.getAllProducts()
        else repo.getAllProducts().filter {
            it.name.contains(q, true) || it.brand.contains(q, true)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), repo.getAllProducts())

    // ── Toast ─────────────────────────────────────────────────────────────────
    private val _toast = MutableStateFlow<String?>(null)
    val toast: StateFlow<String?> = _toast.asStateFlow()

    // ── Actions ───────────────────────────────────────────────────────────────

    fun lookupBarcode(barcode: String) {
        if (barcode.isBlank()) return
        _scannedBarcode.value     = barcode
        _lookupState.value        = LookupState.Loading
        _servings.value           = 1f
        _showManualEntry.value    = false
        viewModelScope.launch(Dispatchers.IO) {
            val result = repo.lookupBarcode(barcode)
            _lookupState.value = if (result.isSuccess) {
                LookupState.Success(result.getOrThrow())
            } else {
                _showManualEntry.value = true
                LookupState.NotFound
            }
        }
    }

    fun incrementServings() { _servings.value = (_servings.value + 0.5f).coerceAtMost(10f) }
    fun decrementServings() { _servings.value = (_servings.value - 0.5f).coerceAtLeast(0.5f) }

    fun logFood() {
        val state = _lookupState.value as? LookupState.Success ?: return
        repo.logFood(state.item, _servings.value)
        showToast("✅ ${state.item.name} logged!")
        _lookupState.value     = LookupState.Idle
        _servings.value        = 1f
        _showManualEntry.value = false
    }

    fun logManualFood(name: String, calories: Int, protein: Float, carbs: Float, fat: Float) {
        repo.logFood(
            FoodItem(
                name     = name,
                calories = calories,
                protein  = protein,
                carbs    = carbs,
                fat      = fat,
                barcode  = _scannedBarcode.value,
                source   = "Manual Entry"
            ), 1f
        )
        showToast("✅ $name logged!")
        _lookupState.value     = LookupState.Idle
        _showManualEntry.value = false
    }

    fun deleteEntry(id: String) {
        repo.deleteEntry(id)
        showToast("🗑️ Removed")
    }

    fun setDailyGoal(goal: Int) {
        _dailyGoal.value = goal
        prefs.edit().putInt("daily_goal", goal).apply()
        showToast("🎯 Goal set to $goal kcal!")
    }

    fun selectDate(date: String) { _selectedDate.value = date }
    fun setSearchQuery(q: String) { _searchQuery.value = q }
    fun resetLookup() { _lookupState.value = LookupState.Idle; _showManualEntry.value = false }
    fun clearToast() { _toast.value = null }
    private fun showToast(msg: String) { _toast.value = msg }
}
