package com.example.dieteasy.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dieteasy.data.repository.FoodItem
import com.example.dieteasy.ui.theme.*
import com.example.dieteasy.viewmodel.MainViewModel

@Composable
fun ProductsScreen(viewModel: MainViewModel, onNavigateToScan: () -> Unit) {
    val searchQuery by viewModel.searchQuery.collectAsState()
    val products    by viewModel.filteredProducts.collectAsState()

    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showDialog = true },
                containerColor = AccentGreen,
                contentColor = DarkBg
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Product")
            }
        },
        containerColor = DarkBg
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Text("🛒 Product Database", style = MaterialTheme.typography.headlineMedium)
            Text("${products.size} products available", color = TextMuted, fontSize = 13.sp)

            Spacer(modifier = Modifier.height(12.dp))

            // Search bar
            OutlinedTextField(
                value       = searchQuery,
                onValueChange = viewModel::setSearchQuery,
                modifier    = Modifier.fillMaxWidth(),
                placeholder = { Text("Search products…", color = TextMuted) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextMuted) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty())
                        IconButton(onClick = { viewModel.setSearchQuery("") }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear", tint = TextMuted)
                        }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor   = AccentGreen,
                    unfocusedBorderColor = DarkBorder,
                    focusedTextColor     = TextPrimary,
                    unfocusedTextColor   = TextPrimary,
                    cursorColor          = AccentGreen
                ),
                shape      = RoundedCornerShape(12.dp),
                singleLine = true,
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search)
            )

            Spacer(modifier = Modifier.height(12.dp))

            if (products.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🔍", fontSize = 40.sp)
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("No products found", color = TextMuted)
                        Text("Try a different search term", color = TextMuted, fontSize = 12.sp)
                    }
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(products, key = { it.barcode + it.name }) { product ->
                        ProductItem(
                            product = product,
                            onClick = {
                                viewModel.lookupBarcode(product.barcode)
                                onNavigateToScan()
                            }
                        )
                    }
                }
            }
        }
    }

    if (showDialog) {
        var name by remember { mutableStateOf("") }
        var brand by remember { mutableStateOf("") }
        var barcode by remember { mutableStateOf("") }
        var caloriesStr by remember { mutableStateOf("") }
        var proteinStr by remember { mutableStateOf("") }
        var carbsStr by remember { mutableStateOf("") }
        var fatStr by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("➕ Add Product", color = TextPrimary, fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Product Name *") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AccentGreen,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedLabelColor = AccentGreen
                        )
                    )
                    OutlinedTextField(
                        value = brand,
                        onValueChange = { brand = it },
                        label = { Text("Brand") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AccentGreen,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedLabelColor = AccentGreen
                        )
                    )
                    OutlinedTextField(
                        value = barcode,
                        onValueChange = { barcode = it },
                        label = { Text("Barcode (Optional)") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AccentGreen,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            unfocusedBorderColor = DarkBorder,
                            focusedLabelColor = AccentGreen
                        )
                    )
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        OutlinedTextField(
                            value = caloriesStr,
                            onValueChange = { caloriesStr = it },
                            label = { Text("kcal *") },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = AccentGreen,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary,
                                unfocusedBorderColor = DarkBorder,
                                focusedLabelColor = AccentGreen
                            )
                        )
                        OutlinedTextField(
                            value = proteinStr,
                            onValueChange = { proteinStr = it },
                            label = { Text("Protein (g)") },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = AccentGreen,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary,
                                unfocusedBorderColor = DarkBorder,
                                focusedLabelColor = AccentGreen
                            )
                        )
                    }
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        OutlinedTextField(
                            value = carbsStr,
                            onValueChange = { carbsStr = it },
                            label = { Text("Carbs (g)") },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = AccentGreen,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary,
                                unfocusedBorderColor = DarkBorder,
                                focusedLabelColor = AccentGreen
                            )
                        )
                        OutlinedTextField(
                            value = fatStr,
                            onValueChange = { fatStr = it },
                            label = { Text("Fat (g)") },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = AccentGreen,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary,
                                unfocusedBorderColor = DarkBorder,
                                focusedLabelColor = AccentGreen
                            )
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val calories = caloriesStr.toIntOrNull()
                        if (name.isNotBlank() && calories != null) {
                            viewModel.addManualProduct(
                                name = name,
                                brand = brand,
                                barcode = barcode,
                                calories = calories,
                                protein = proteinStr.toFloatOrNull() ?: 0f,
                                carbs = carbsStr.toFloatOrNull() ?: 0f,
                                fat = fatStr.toFloatOrNull() ?: 0f
                            )
                            showDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentGreen, contentColor = DarkBg)
                ) {
                    Text("Save")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { showDialog = false },
                    colors = ButtonDefaults.textButtonColors(contentColor = TextMuted)
                ) {
                    Text("Cancel")
                }
            },
            containerColor = DarkCard
        )
    }
}

@Composable
fun ProductItem(product: FoodItem, onClick: () -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        color    = DarkCard,
        shape    = RoundedCornerShape(12.dp),
        border   = BorderStroke(1.dp, DarkBorder)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(product.name, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                Text(
                    "${product.brand} · ${product.barcode}",
                    color = TextMuted,
                    fontSize = 11.sp
                )
                Row(
                    modifier = Modifier.padding(top = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MacroTag("P:${"%.1f".format(product.protein)}g", AccentCyan)
                    MacroTag("C:${"%.1f".format(product.carbs)}g",   WarnOrange)
                    MacroTag("F:${"%.1f".format(product.fat)}g",     DangerRed)
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    "${product.calories}",
                    color = AccentGreen,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 20.sp
                )
                Text("kcal", color = TextMuted, fontSize = 11.sp)
            }
        }
    }
}

@Composable
fun MacroTag(text: String, color: androidx.compose.ui.graphics.Color) {
    Surface(
        color  = color.copy(alpha = 0.12f),
        shape  = RoundedCornerShape(4.dp)
    ) {
        Text(text, modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
            color = color, fontSize = 10.sp)
    }
}
