package com.example.apexchess.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.random.Random

// --- Chess Logic Definitions ---
enum class PieceColor { WHITE, BLACK }
enum class PieceType(val symbol: String, val value: Int) {
    PAWN("P", 1),
    KNIGHT("N", 3),
    BISHOP("B", 3),
    ROOK("R", 5),
    QUEEN("Q", 9),
    KING("K", 100)
}

data class ChessPiece(val type: PieceType, val color: PieceColor) {
    fun getUnicode(): String = when (color) {
        PieceColor.WHITE -> when (type) {
            PieceType.PAWN -> "♙"
            PieceType.KNIGHT -> "♘"
            PieceType.BISHOP -> "♗"
            PieceType.ROOK -> "♖"
            PieceType.QUEEN -> "♕"
            PieceType.KING -> "♔"
        }
        PieceColor.BLACK -> when (type) {
            PieceType.PAWN -> "♟"
            PieceType.KNIGHT -> "♞"
            PieceType.BISHOP -> "♝"
            PieceType.ROOK -> "♜"
            PieceType.QUEEN -> "♛"
            PieceType.KING -> "♚"
        }
    }
}

data class BoardPosition(val row: Int, val col: Int) {
    fun toNotation(): String {
        val colChar = ('a' + col)
        val rowNum = 8 - row
        return "$colChar$rowNum"
    }
}

data class MoveRecord(val from: BoardPosition, val to: BoardPosition, val piece: ChessPiece, val captured: ChessPiece? = null)

enum class ThemePreset(val darkColor: Color, val lightColor: Color, val title: String) {
    CLASSIC(Color(0xFFB58863), Color(0xFFF0D9B5), "Classic Wood"),
    NEON(Color(0xFF06B6D4), Color(0xFF1E293B), "Cyber Neon"),
    EMERALD(Color(0xFF2E7D32), Color(0xFFA5D6A7), "Emerald Mint"),
    MIDNIGHT(Color(0xFF312E81), Color(0xFFC7D2FE), "Midnight Gold")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppScreen() {
    var board by remember { mutableStateOf(initialBoard()) }
    var selectedPos by remember { mutableStateOf<BoardPosition?>(null) }
    var turn by remember { mutableStateOf(PieceColor.WHITE) }
    var moveHistory by remember { mutableStateOf(listOf<MoveRecord>()) }
    var capturedWhite by remember { mutableStateOf(listOf<ChessPiece>()) }
    var capturedBlack by remember { mutableStateOf(listOf<ChessPiece>()) }
    var aiDifficulty by remember { mutableStateOf("Medium") }
    var isVsAi by remember { mutableStateOf(true) }
    var currentTheme by remember { mutableStateOf(ThemePreset.CLASSIC) }
    var gameStatus by remember { mutableStateOf("Game in Progress") }
    var evalScore by remember { mutable