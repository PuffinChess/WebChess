import { Piece } from "../pieces/Piece";
import { Position } from "../utils/Position";
import { castleKingSide, castleQueenSide } from "./CastleAllowedCheck";
import { PieceType } from "../pieces/PieceType";

export function performCastling(castling: string, pieceFromPosition: Piece, toPosition: Position, fromPosition: Position, prevPieces: Piece[]) {
    
    if (castling?.includes("K") && pieceFromPosition.type === PieceType.KingWhite && (toPosition.y === 7 && toPosition.x === 6)) {
        if(castleKingSide(7, prevPieces)){
            let castledWhiteKingSide = prevPieces.map(piece => {
                if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                    return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                } else if (piece.position.x === 7 && piece.position.y === 7) {
                    // Handle moving the rook
                    return { ...piece, position: { x: 5, y: 7 } }; // Assuming the rook's new position after castling is (5, 7)
                }
                return piece;
            });

            castling = castling.replace(/[KQ]/g, '');
            sessionStorage.setItem("castling", castling);
            return castledWhiteKingSide;
        }
    }
    else if (castling?.includes("k") && pieceFromPosition.type === PieceType.KingBlack && (toPosition.y === 0 && toPosition.x === 6)) {
        if (castleKingSide(0, prevPieces)) {
            let castledBlackKingSide = prevPieces.map(piece => {
                if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                    return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                } else if (piece.position.x === 7 && piece.position.y === 0) {
                    // Handle moving the rook
                    return { ...piece, position: { x: 5, y: 0 } }; // Assuming the rook's new position after castling is (5, 7)
                }
                return piece;
            });
            castling = castling.replace(/[kq]/g, '');
            sessionStorage.setItem("castling", castling);
            return castledBlackKingSide;
        }
    }
    else if (castling?.includes("Q") && pieceFromPosition.type === PieceType.KingWhite && (toPosition.y === 7 && toPosition.x === 2)) {
        if (castleQueenSide(7, prevPieces)) {
            let castledWhiteQueenSide = prevPieces.map(piece => {
                if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                    return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                } else if (piece.position.x === 0 && piece.position.y === 7) {
                    // Handle moving the rook
                    return { ...piece, position: { x: 3, y: 7 } }; // Assuming the rook's new position after castling is (5, 7)
                }
                return piece;
            });
            castling = castling.replace(/[KQ]/g, '');
            sessionStorage.setItem("castling", castling);
            return castledWhiteQueenSide;
        }
    }
    else if (castling?.includes("q") && pieceFromPosition.type === PieceType.KingBlack && (toPosition.y === 0 && toPosition.x === 2)){
        if (castleQueenSide(0, prevPieces)) {
            let castledBlackQueenSide = prevPieces.map(piece => {
                if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                    return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                } else if (piece.position.x === 0 && piece.position.y === 0) {
                    // Handle moving the rook
                    return { ...piece, position: { x: 3, y: 0 } }; // Assuming the rook's new position after castling is (5, 7)
                }
                return piece;
            });
            castling = castling.replace(/[kq]/g, '');
            sessionStorage.setItem("castling", castling);
            return castledBlackQueenSide;
        }
    }
}
