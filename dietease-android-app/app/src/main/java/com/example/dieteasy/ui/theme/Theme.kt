package com.example.dieteasy.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DietEaseDarkColors = darkColorScheme(
    primary          = AccentGreen,
    onPrimary        = DarkBg,
    secondary        = AccentCyan,
    onSecondary      = DarkBg,
    background       = DarkBg,
    onBackground     = TextPrimary,
    surface          = DarkSurface,
    onSurface        = TextPrimary,
    surfaceVariant   = DarkCard,
    onSurfaceVariant = TextMuted,
    error            = DangerRed,
    outline          = DarkBorder,
)

@Composable
fun DieteasyTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DietEaseDarkColors,
        typography  = Typography,
        content     = content
    )
}