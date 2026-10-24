export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type BoardState = (Piece | null)[][];

export interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  piece: Piece;
  captured: Piece | null;
  notation: string;
}

export class ChessEngine {
  board: BoardState;
  turn: PieceColor;
  history: Move[];
  isGameOver: boolean;
  statusMessage: string;

  constructor() {
    this.board = this.createInitialBoard();
    this.turn = 'w';
    this.history = [];
    this.isGameOver = false;
    this.statusMessage = 'White to move';
  }

  createInitialBoard(): BoardState {
    const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));