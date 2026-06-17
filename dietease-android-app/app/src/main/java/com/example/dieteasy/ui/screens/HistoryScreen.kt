package com.example.dieteasy.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dieteasy.data.local.FoodLogEntry
import com.example.dieteasy.ui.theme.*
import com.example.dieteasy.viewmodel.MainViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
fun HistoryScreen(viewModel: MainViewModel) {
    val dates          by viewModel.historyDates.collectAsState()
    val selectedDate   by viewModel.selectedDate.collectAsState()
    val selectedLog    by viewModel.selectedDateLog.collectAsState()

    Row(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        // ── Date list sidebar ──
        Column(
            modifier = Modifier
                .width(110.dp)
                .fillMaxHeight()
                .background(DarkSurface)
                .padding(vertical = 8.dp)
        ) {
            Text(
                "📅 History",
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                color = TextMuted,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )

            if (dates.isEmpty()) {
                Text(
                    "No history\nyet",
                    modifier = Modifier.padding(10.dp),
                    color = TextMuted,
                    fontSize = 12.sp
                )
            } else {
                LazyColumn {
                    items(dates) { date ->
                        val isSelected = date == selectedDate
                        val label = try {
                            val d = LocalDate.parse(date)
                            if (d == LocalDate.now()) "Today"
                            else "${d.dayOfMonth} ${d.month.name.take(3)}"
                        } catch (_: Exception) { date }

                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 6.dp, vertical = 3.dp)
                                .clickable { viewModel.selectDate(date) },
                            color  = if (isSelected) AccentGreen.copy(alpha = 0.15f) else DarkCard,
                            shape  = RoundedCornerShape(8.dp),
                            border = if (isSelected) BorderStroke(1.dp, AccentGreen.copy(0.5f)) else null
                        ) {
                            Text(
                                label,
                                modifier = Modifier.padding(8.dp),
                                color = if (isSelected) AccentGreen else TextPrimary,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    }
                }
            }
        }

        // ── Day detail ──
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp)
        ) {
            if (selectedLog.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("📭", fontSize = 40.sp)
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("No entries for this day", color = TextMuted)
                    }
                }
            } else {
                // Summary row
                val totalCal  = selectedLog.sumOf { it.loggedCalories }
                val totalProt = selectedLog.sumOf { (it.protein * it.servings).toDouble() }
                val totalCarb = selectedLog.sumOf { (it.carbs * it.servings).toDouble() }
                val totalFat  = selectedLog.sumOf { (it.fat * it.servings).toDouble() }

                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color    = DarkCard,
                    shape    = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        HistMacroBox("$totalCal",                         "kcal",    AccentGreen)
                        HistMacroBox("${"%.1f".format(totalProt)}g",      "protein", AccentCyan)
                        HistMacroBox("${"%.1f".format(totalCarb)}g",      "carbs",   WarnOrange)
                        HistMacroBox("${"%.1f".format(totalFat)}g",       "fat",     DangerRed)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(selectedLog) { entry ->
                        HistoryLogItem(entry)
                    }
                }
            }
        }
    }
}

@Composable
fun HistMacroBox(value: String, label: String, color: androidx.compose.ui.graphics.Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, color = color, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Text(label, color = TextMuted, fontSize = 10.sp)
    }
}

@Composable
fun HistoryLogItem(entry: FoodLogEntry) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color    = DarkCard,
        shape    = RoundedCornerShape(10.dp),
        border   = BorderStroke(1.dp, DarkBorder)
    ) {
        Row(
            modifier = Modifier.padding(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(entry.name, color = TextPrimary, fontWeight = FontWeight.Medium)
                Text("${entry.servings}× serving", color = TextMuted, fontSize = 12.sp)
            }
            Text("${entry.loggedCalories} kcal", color = AccentGreen, fontWeight = FontWeight.Bold)
        }
    }
}
