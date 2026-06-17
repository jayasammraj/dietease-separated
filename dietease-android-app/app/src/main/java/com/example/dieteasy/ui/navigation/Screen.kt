package com.example.dieteasy.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val label: String, val icon: ImageVector) {
    object Scan     : Screen("scan",     "Scan",     Icons.Default.QrCodeScanner)
    object Today    : Screen("today",    "Today",    Icons.Default.Today)
    object History  : Screen("history",  "History",  Icons.Default.History)
    object Products : Screen("products", "Products", Icons.Default.LocalGroceryStore)
}

val bottomNavItems = listOf(Screen.Scan, Screen.Today, Screen.History, Screen.Products)
