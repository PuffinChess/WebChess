import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";
import { PieceType } from "../pieces/PieceType";

export function isLegalPawnMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[], pawn: Piece): boolean {
    const movementX = fromPosition.x - toPosition.x;
    const movementY = fromPosition.y - toPosition.y;

    const pieceOneAhead = false;
    const pieceTwoAhead = false;
    const captureRight = false;
    const captureLeft = false;

    switch (pawn.type) {
        case PieceType.PawnWhite: {
            if (movementX === 0 && movementY === 1){
                return true;
            }
            else if (movementX === 0 && movementY === 2 && fromPosition.y === 6) {
                return true;
            }
            else if (movementX === 1 && movementY === 1) {
                return true
            }
            return false;
        }
        case PieceType.PawnBlack: {
            if (movementX === 0 && movementY === -1) {
                return true;
            }
            else if (movementX === 0 && movementY === -2 && fromPosition.y === 1) {
                return true;
            }
            return false;
        }
    }
    return false;
}