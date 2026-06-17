package com.example.dieteasy.ui.screens

import android.Manifest
import android.util.Size
import androidx.camera.core.CameraSelector
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.example.dieteasy.data.repository.FoodItem
import com.example.dieteasy.ui.theme.*
import com.example.dieteasy.viewmodel.LookupState
import com.example.dieteasy.viewmodel.MainViewModel
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.Executors

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun ScanScreen(viewModel: MainViewModel) {
    val lookupState   by viewModel.lookupState.collectAsState()
    val servings      by viewModel.servings.collectAsState()
    val showManual    by viewModel.showManualEntry.collectAsState()
    var manualBarcode by remember { mutableStateOf("") }
    var cameraActive  by remember { mutableStateOf(false) }

    val cameraPermission = rememberPermissionState(Manifest.permission.CAMERA)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // ── Header ────────────────────────────────────────────────────────────
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("🥗", fontSize = 28.sp)
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    "DietEase+",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        brush = Brush.horizontalGradient(listOf(AccentGreen, AccentCyan)),
                        fontWeight = FontWeight.ExtraBold
                    )
                )
                Surface(
                    color = AccentGreen.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        "BARCODE SCANNER",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                        color = AccentGreen,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // ── Camera toggle ─────────────────────────────────────────────────────
        if (!cameraActive) {
            Button(
                onClick = {
                    if (cameraPermission.status.isGranted) cameraActive = true
                    else cameraPermission.launchPermissionRequest()
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                colors   = ButtonDefaults.buttonColors(containerColor = DarkCard),
                shape    = RoundedCornerShape(12.dp),
                border   = BorderStroke(1.dp, AccentGreen.copy(alpha = 0.4f))
            ) {
                Icon(Icons.Default.CameraAlt, contentDescription = null, tint = AccentGreen)
                Spacer(modifier = Modifier.width(8.dp))
                Text("📷 Start Camera Scanner", color = TextPrimary)
            }
        } else {
            CameraPreview(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .clip(RoundedCornerShape(16.dp)),
                onBarcodeDetected = { barcode ->
                    cameraActive = false
                    viewModel.lookupBarcode(barcode)
                }
            )
            Spacer(modifier = Modifier.height(8.dp))
            TextButton(onClick = { cameraActive = false }) {
                Text("✕ Close Camera", color = TextMuted)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ── Manual barcode input ──────────────────────────────────────────────
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value         = manualBarcode,
                onValueChange = { manualBarcode = it },
                modifier      = Modifier.weight(1f),
                label         = { Text("Enter barcode number…", color = TextMuted) },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Number,
                    imeAction    = ImeAction.Search
                ),
                keyboardActions = KeyboardActions(
                    onSearch = {
                        viewModel.lookupBarcode(manualBarcode.trim())
                        manualBarcode = ""
                    }
                ),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor   = AccentGreen,
                    unfocusedBorderColor = DarkBorder,
                    focusedTextColor     = TextPrimary,
                    unfocusedTextColor   = TextPrimary,
                    cursorColor          = AccentGreen
                ),
                shape      = RoundedCornerShape(12.dp),
                singleLine = true
            )
            Button(
                onClick = {
                    viewModel.lookupBarcode(manualBarcode.trim())
                    manualBarcode = ""
                },
                colors   = ButtonDefaults.buttonColors(containerColor = AccentGreen),
                shape    = RoundedCornerShape(12.dp),
                modifier = Modifier.height(56.dp)
            ) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = DarkBg)
            }
        }

        // ── Source badges ─────────────────────────────────────────────────────
        Row(
            modifier = Modifier.padding(top = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            listOf("⚡ Built-in DB", "🌍 Open Food Facts", "✏️ Manual").forEach { tag ->
                Surface(
                    color  = DarkCard,
                    shape  = RoundedCornerShape(6.dp),
                    border = BorderStroke(1.dp, DarkBorder)
                ) {
                    Text(
                        tag,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        color    = TextMuted,
                        fontSize = 11.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ── Lookup state ──────────────────────────────────────────────────────
        when (val state = lookupState) {
            is LookupState.Loading -> {
                Box(
                    Modifier.fillMaxWidth().padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator(color = AccentGreen)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Looking up barcode…", color = TextMuted)
                    }
                }
            }
            is LookupState.Success -> {
                ResultCard(
                    item      = state.item,
                    servings  = servings,
                    onPlus    = viewModel::incrementServings,
                    onMinus   = viewModel::decrementServings,
                    onLog     = viewModel::logFood,
                    onDismiss = viewModel::resetLookup
                )
            }
            is LookupState.NotFound, is LookupState.Error -> {
                if (showManual) {
                    ManualEntryForm(viewModel)
                } else {
                    Surface(
                        color  = DangerRed.copy(alpha = 0.1f),
                        shape  = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, DangerRed.copy(alpha = 0.3f))
                    ) {
                        Text(
                            "❌ Product not found. Fill details manually below.",
                            modifier = Modifier.padding(16.dp),
                            color    = DangerRed
                        )
                    }
                }
            }
            else -> {}
        }
    }
}

// ── Result Card ───────────────────────────────────────────────────────────────
@Composable
fun ResultCard(
    item: FoodItem,
    servings: Float,
    onPlus: () -> Unit,
    onMinus: () -> Unit,
    onLog: () -> Unit,
    onDismiss: () -> Unit
) {
    val displayCal = (item.calories * servings).toInt()

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color    = DarkCard,
        shape    = RoundedCornerShape(16.dp),
        border   = BorderStroke(1.dp, AccentGreen.copy(alpha = 0.3f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(item.name, style = MaterialTheme.typography.titleLarge)
                    if (item.brand.isNotBlank())
                        Text(item.brand, color = AccentGreen, fontSize = 13.sp)
                    Text("📦 ${item.source}", color = TextMuted, fontSize = 11.sp)
                }
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = TextMuted)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                MacroBox("$displayCal",                              "kcal",    AccentGreen)
                MacroBox("${"%.1f".format(item.protein * servings)}g", "protein", AccentCyan)
                MacroBox("${"%.1f".format(item.carbs * servings)}g",   "carbs",   WarnOrange)
                MacroBox("${"%.1f".format(item.fat * servings)}g",     "fat",     DangerRed)
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Servings (×100g)", color = TextMuted, fontSize = 13.sp)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onMinus, modifier = Modifier.size(36.dp)) {
                        Text("−", color = AccentGreen, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    }
                    Text(
                        "${"%.1f".format(servings)}",
                        color      = TextPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize   = 18.sp,
                        modifier   = Modifier.padding(horizontal = 12.dp)
                    )
                    IconButton(onClick = onPlus, modifier = Modifier.size(36.dp)) {
                        Text("+", color = AccentGreen, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick  = onLog,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors   = ButtonDefaults.buttonColors(containerColor = AccentGreen),
                shape    = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, tint = DarkBg)
                Spacer(modifier = Modifier.width(6.dp))
                Text("＋ Log This Food", color = DarkBg, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun MacroBox(value: String, label: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, color = color, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Text(label, color = TextMuted, fontSize = 11.sp)
    }
}

// ── Manual Entry Form ─────────────────────────────────────────────────────────
@Composable
fun ManualEntryForm(viewModel: MainViewModel) {
    var name     by remember { mutableStateOf("") }
    var calories by remember { mutableStateOf("") }
    var protein  by remember { mutableStateOf("") }
    var carbs    by remember { mutableStateOf("") }
    var fat      by remember { mutableStateOf("") }

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color    = DarkCard,
        shape    = RoundedCornerShape(16.dp),
        border   = BorderStroke(1.dp, AccentCyan.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text("📝 Add Product Manually", style = MaterialTheme.typography.titleLarge)

            @Composable
            fun Field(
                value: String,
                onValueChange: (String) -> Unit,
                label: String,
                keyboardType: KeyboardType = KeyboardType.Text
            ) {
                OutlinedTextField(
                    value         = value,
                    onValueChange = onValueChange,
                    modifier      = Modifier.fillMaxWidth(),
                    label         = { Text(label, color = TextMuted) },
                    keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor   = AccentCyan,
                        unfocusedBorderColor = DarkBorder,
                        focusedTextColor     = TextPrimary,
                        unfocusedTextColor   = TextPrimary,
                        cursorColor          = AccentCyan
                    ),
                    shape      = RoundedCornerShape(10.dp),
                    singleLine = true
                )
            }

            Field(name,     { name = it },     "Product Name *")
            Field(calories, { calories = it },  "Calories (kcal) *", KeyboardType.Number)
            Field(protein,  { protein = it },   "Protein (g)",       KeyboardType.Decimal)
            Field(carbs,    { carbs = it },     "Carbs (g)",         KeyboardType.Decimal)
            Field(fat,      { fat = it },       "Fat (g)",           KeyboardType.Decimal)

            Button(
                onClick = {
                    if (name.isNotBlank() && calories.isNotBlank()) {
                        viewModel.logManualFood(
                            name     = name,
                            calories = calories.toIntOrNull() ?: 0,
                            protein  = protein.toFloatOrNull() ?: 0f,
                            carbs    = carbs.toFloatOrNull() ?: 0f,
                            fat      = fat.toFloatOrNull() ?: 0f
                        )
                    }
                },
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors   = ButtonDefaults.buttonColors(containerColor = AccentCyan),
                shape    = RoundedCornerShape(12.dp)
            ) {
                Text("💾 Save & Log", color = DarkBg, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// ── Camera Preview with ML Kit barcode scanning ───────────────────────────────
@androidx.annotation.OptIn(ExperimentalGetImage::class)
@Composable
fun CameraPreview(modifier: Modifier = Modifier, onBarcodeDetected: (String) -> Unit) {
    val context        = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    var detected       by remember { mutableStateOf(false) }
    val executor       = remember { Executors.newSingleThreadExecutor() }
    val scanner        = remember { BarcodeScanning.getClient() }

    AndroidView(
        modifier = modifier,
        factory  = { ctx ->
            PreviewView(ctx).apply {
                implementationMode = PreviewView.ImplementationMode.COMPATIBLE
            }
        },
        update = { previewView ->
            val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
            cameraProviderFuture.addListener({
                val cameraProvider = cameraProviderFuture.get()

                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }

                val analysis = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build()
                    .also { ia ->
                        ia.setAnalyzer(executor) { imageProxy ->
                            val mediaImage = imageProxy.image
                            if (mediaImage != null && !detected) {
                                val image = InputImage.fromMediaImage(
                                    mediaImage,
                                    imageProxy.imageInfo.rotationDegrees
                                )
                                scanner.process(image)
                                    .addOnSuccessListener { barcodes ->
                                        barcodes.firstOrNull()?.rawValue?.let { code ->
                                            if (!detected) {
                                                detected = true
                                                onBarcodeDetected(code)
                                            }
                                        }
                                    }
                                    .addOnCompleteListener { imageProxy.close() }
                            } else {
                                imageProxy.close()
                            }
                        }
                    }

                runCatching {
                    cameraProvider.unbindAll()
                    cameraProvider.bindToLifecycle(
                        lifecycleOwner,
                        CameraSelector.DEFAULT_BACK_CAMERA,
                        preview,
                        analysis
                    )
                }
            }, ContextCompat.getMainExecutor(context))
        }
    )
}
