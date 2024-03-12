import { Piece } from "../pieces/Piece";
import { PieceType } from "../pieces/PieceType";
import { Position } from "../utils/Position";
import { isLegalBishopMovement } from "./BishopMovement";
import { isLegalKingMovement } from "./KingMovement";
import { isLegalKnightMovement } from "./KnightMovement";
import { isLegalPawnMovement } from "./PawnMovement";
import { isLegalQueenMovement } from "./QueenMovement";
import { isLegalRookMovement } from "./RookMovement";

    
export function isPieceMovementLegal(pieceFromPosition: Piece, fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean{

    switch (pieceFromPosition.type) {
        case PieceType.RookBlack: {
            if (!isLegalRookMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.RookWhite: {
            if (!isLegalRookMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.BishopBlack: {
            if (!isLegalBishopMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.BishopWhite: {
            if (!isLegalBishopMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.KnightBlack: {
            if (!isLegalKnightMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.KnightWhite: {
            if (!isLegalKnightMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.QueenBlack: {
            if (!isLegalQueenMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.QueenWhite: {
            if (!isLegalQueenMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.KingBlack: {
            if (!isLegalKingMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.KingWhite: {
            if (!isLegalKingMovement(fromPosition, toPosition, prevPieces)) {
                return false;
            }
            return true;
        }
        case PieceType.PawnBlack: {
            if (!isLegalPawnMovement(fromPosition, toPosition, prevPieces, pieceFromPosition)) {
                return false;
            }
            return true;
        }
        case PieceType.PawnWhite: {
            if (!isLegalPawnMovement(fromPosition, toPosition, prevPieces, pieceFromPosition)) {
                return false;
            }
            return true;
        }
        default: {
            return false;
        }
    }

    return false;
}    
    