import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";
import { PieceType } from "../pieces/PieceType";

//Removes right for certain types of castling depending on piece movement //Could move to different file
export function castlingRightsUpdater(pieceFromPosition: Piece, castling: string, fromPosition: Position) {
    switch (pieceFromPosition.type) {
        case PieceType.KingWhite:
            if (castling.includes("K") || castling.includes("Q")) {
                castling = castling.replace(/[KQ]/g, '');
            }
            break;
        case PieceType.KingBlack:
            if (castling.includes("k") || castling.includes("q")) {
                castling = castling.replace(/[kq]/g, '');
            }
            break;
        case PieceType.RookWhite:
            if (castling.includes("K") && fromPosition.x === 7 && fromPosition.y === 7) {
                castling = castling.replace(/[K]/g, '');
            }
            else if (castling.includes("Q") && fromPosition.x === 0 && fromPosition.y === 7) {
                castling = castling.replace(/[Q]/g, '');
            }
            break;
        case PieceType.RookBlack:
            if (castling.includes("k") || castling.includes("q")) {
                if (fromPosition.x === 0 && fromPosition.y === 0) {
                    castling = castling.replace(/[q]/g, '');
                } else if (fromPosition.x === 7 && fromPosition.y === 0) {
                    castling = castling.replace(/[k]/g, '');
                }
            }
            break;
        default:
            break;
    }
    sessionStorage.setItem("castling", castling);
}