export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export type BoardState = (Piece | null)[][];

export interface Position {
  r: number;
  c: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece | null;
  promotion?: PieceType;
  isCastling?: 'ks' | 'qs';
  isEnPassant?: boolean;
  san?: string;
}

export interface MoveAnalysis extends Move {
  evaluation: number;
  quality: 'brilliant' | 'great' | 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
}

export type GameMode = 'vs-ai' | 'pass-and-play' | 'puzzles' | 'vision';

export type AIPersonality = 'magnus' | 'garry' | 'pete' | 'nora' | 'chaos';

export interface AIPersonalityInfo {
  id: AIPersonality;
  name: string;
  rating: number;
  avatar: string;
  style: string;
  depth: number;
}