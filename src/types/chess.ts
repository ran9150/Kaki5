export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type Board = (Piece | null)[][];

export interface Move {
  from: [number, number];
  to: [number, number];
  piece: Piece;
  captured?: Piece | null;
  notation: string;
  isCheck?: boolean;
  isCheckmate?: boolean;
  accuracy?: 'brilliant' | 'great' | 'best' | 'inaccuracy' | 'blunder';
}

export interface GameState {
  board: Board;
  turn: PieceColor;
  moveHistory: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: PieceColor | 'draw' | null;
  capturedWhite: PieceType[];
  capturedBlack: PieceType[];
  evaluation: number;
}

export type BotPersonality = 'magnus' | 'garry' | 'pete' | 'nora' | 'chaos';

export interface BotInfo {
  id: BotPersonality;
  name: string;
  elo: number;
  avatar: string;
  depth: number;
  description: string;
}