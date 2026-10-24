import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Cpu, Trophy, Zap, Shield, Eye, Flame, Award, ChevronRight, BarChart2 } from 'lucide-react';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | 'P' | 'R' | 'N' | 'B' | 'Q' | 'K' | null;
type BoardState = PieceType[][];

const INITIAL_BOARD: BoardState = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p