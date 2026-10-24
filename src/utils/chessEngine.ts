import { Board, Piece, PieceColor, PieceType, Move } from '../types/chess';

export const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  const setupRow = (row: number, color: PieceColor) => {
    const pieces: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    pieces.forEach((p, col) => {
      board[row][col] = { type: p, color };
    });
  };

  setupRow(0, 'b');
  for (let col = 0; col < 8; col++) board[1][col] = { type: 'p', color: 'b' };

  for (let col = 0; col < 8; col++) board[6][col] = { type: 'p', color: 'w' };
  setupRow(7, 'w');

  return board;
}

const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

export function evaluateBoard(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type];
        // Positional center bias
        const centerBonus = (3.5 - Math.abs(r - 3.5)) + (3.5 - Math.abs(c - 3.5));
        const total = val + centerBonus * 5;
        score += piece.color === 'w' ? total : -total;
      }
    }
  }
  return score;
}

export function isValidSquare(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function getLegalMoves(board: Board, r: number, c: number): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  
  const moves: [number, number][] = [];
  const color = piece.color;

  const addMove = (nr: number, nc: number): boolean => {
    if (!isValidSquare(nr, nc)) return false;
    const target = board[nr][nc];
    if (!target) {
      moves.push([nr, nc]);
      return true;
    }
    if (target.color !== color) {
      moves.push([nr, nc]);
    }
    return false;
  };

  switch (piece.type) {
    case 'p': {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      // Forward 1
      if (isValidSquare(r + dir, c) && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        // Forward 2
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Captures
      for (const dc of [-1, 1]) {
        if (isValidSquare(r + dir, c + dc)) {
          const target = board[r + dir][c + dc];
          if (target && target.color !== color) {
            moves.push([r + dir, c + dc]);
          }
        }
      }
      break;
    }
    case 'n': {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightOffsets) addMove(r + dr, c + dc);
      break;
    }
    case 'b': {
      const bishopDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dr, dc] of bishopDirs) {
        let nr = r + dr, nc = c + dc;
        while (addMove(nr, nc)) { nr += dr; nc += dc; }
      }
      break;
    }
    case 'r': {
      const rookDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of rookDirs) {
        let nr = r + dr, nc = c + dc;
        while (addMove(nr, nc)) { nr += dr; nc += dc; }
      }
      break;
    }
    case 'q': {
      const queenDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of queenDirs) {
        let nr = r + dr, nc = c + dc;
        while (addMove(nr, nc)) { nr += dr; nc += dc; }
      }
      break;
    }
    case 'k': {
      const kingDirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [dr, dc] of kingDirs) addMove(r + dr, c + dc);
      break;
    }
  }

  return moves;
}

export function getAllLegalMoves(board: Board, color: PieceColor): { from: [number, number]; to: [number, number] }[] {
  const allMoves: { from: [number, number]; to: [number, number] }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === color) {
        const targets = getLegalMoves(board, r, c);
        for (const target of targets) {
          allMoves.push({ from: [r, c], to: target });
        }
      }
    }
  }
  return allMoves;
}

export function playWebAudioSound(type: 'move' | 'capture' |