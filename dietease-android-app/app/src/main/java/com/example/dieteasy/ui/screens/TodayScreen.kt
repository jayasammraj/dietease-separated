package com.example.dieteasy.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dieteasy.data.local.FoodLogEntry
import com.example.dieteasy.ui.theme.*
import com.example.dieteasy.viewmodel.MainViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun TodayScreen(viewModel: MainViewModel) {
    val todayLog     by viewModel.todayLog.collectAsState()
    val totalCal     by viewModel.totalCalories.collectAsState()
    val dailyGoal    by viewModel.dailyGoal.collectAsState()
    var showGoalDial by remember { mutableStateOf(false) }
    var goalInput    by remember { mutableStateOf(dailyGoal.toString()) }

    val progress = if (dailyGoal > 0) (totalCal.toFloat() / dailyGoal).coerceIn(0f, 1f) else 0f
    val today    = SimpleDateFormat("EEEE, MMM d", Locale.getDefault()).format(Date())

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        // ── Header card ──
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color    = DarkSurface
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("📅 Today", style = MaterialTheme.typography.headlineMedium)
                        Text(today, color = TextMuted, fontSize = 13.sp)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = { showGoalDial = true; goalInput = dailyGoal.toString() },
                        ) {
                            Icon(Icons.Default.Edit, contentDescription = "Edit goal", tint = AccentGreen)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        IconButton(
                            onClick = { viewModel.logoutUser() },
                        ) {
                            Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = "Logout", tint = DangerRed)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Calorie total + goal
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        "$totalCal",
                        fontSize = 42.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = AccentGreen
                    )
                    Text(" / $dailyGoal kcal", color = TextMuted, fontSize = 14.sp,
                        modifier = Modifier.padding(bottom = 6.dp))
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Progress bar
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .background(DarkBorder, RoundedCornerShape(4.dp))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(progress)
                            .fillMaxHeight()
                            .background(
                                Brush.horizontalGradient(listOf(AccentGreen, AccentCyan)),
                                RoundedCornerShape(4.dp)
                            )
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Macro summary
                val prot = todayLog.sumOf { (it.protein * it.servings).toDouble() }
                val carb = todayLog.sumOf { (it.carbs  * it.servings).toDouble() }
                val fat  = todayLog.sumOf { (it.fat    * it.servings).toDouble() }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    TodayMacro("${"%.1f".format(prot)}g", "Protein", AccentCyan)
                    TodayMacro("${"%.1f".format(carb)}g", "Carbs",   WarnOrange)
                    TodayMacro("${"%.1f".format(fat)}g",  "Fat",     DangerRed)
                }
            }
        }

        // ── Food log list ──
        if (todayLog.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🍽️", fontSize = 48.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("No food logged yet today", color = TextMuted, fontSize = 16.sp)
                    Text("Scan a barcode to get started!", color = TextMuted, fontSize = 13.sp)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(todayLog, key = { it.id }) { entry ->
                    FoodLogItem(entry = entry, onDelete = { viewModel.deleteEntry(entry.id) })
                }
            }
        }
    }

    // ── Goal dialog ──
    if (showGoalDial) {
        AlertDialog(
            onDismissRequest = { showGoalDial = false },
            containerColor   = DarkCard,
            title = { Text("🎯 Daily Calorie Goal", color = TextPrimary) },
            text  = {
                OutlinedTextField(
                    value = goalInput,
                    onValueChange = { goalInput = it.filter { c -> c.isDigit() } },
                    label = { Text("Calories (kcal)", color = TextMuted) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor   = AccentGreen,
                        unfocusedBorderColor = DarkBorder,
                        focusedTextColor     = TextPrimary,
                        unfocusedTextColor   = TextPrimary
                    ),
                    shape = RoundedCornerShape(10.dp),
                    singleLine = true
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        val g = goalInput.toIntOrNull()
                        if (g != null && g >= 100) {
                            viewModel.setDailyGoal(g)
                            showGoalDial = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentGreen)
                ) { Text("Save", color = DarkBg) }
            },
            dismissButton = {
                TextButton(onClick = { showGoalDial = false }) {
                    Text("Cancel", color = TextMuted)
                }
            }
        )
    }
}

@Composable
fun TodayMacro(value: String, label: String, color: androidx.compose.ui.graphics.Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, color = color, fontWeight = FontWeight.Bold, fontSize = 15.sp)
        Text(label, color = TextMuted, fontSize = 11.sp)
    }
}

@Composable
fun FoodLogItem(entry: FoodLogEntry, onDelete: () -> Unit) {
    val time = remember(entry.loggedAt) {
        SimpleDateFormat("h:mm a", Locale.getDefault()).format(Date(entry.loggedAt))
    }

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color    = DarkCard,
        shape    = RoundedCornerShape(12.dp),
        border   = BorderStroke(1.dp, DarkBorder)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(entry.name, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
                Text(
                    "${entry.servings}× · $time · ${entry.source.ifBlank { "Manual" }}",
                    color = TextMuted, fontSize = 12.sp
                )
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    "${entry.loggedCalories} kcal",
                    color = AccentGreen,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Text(
                    "P:${"%.1f".format(entry.protein)}g C:${"%.1f".format(entry.carbs)}g F:${"%.1f".format(entry.fat)}g",
                    color = TextMuted, fontSize = 10.sp
                )
            }
            IconButton(onClick = onDelete, modifier = Modifier.size(36.dp)) {
                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = DangerRed, modifier = Modifier.size(18.dp))
            }
        }
    }
}
