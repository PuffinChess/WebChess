import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";

export function isLegalKingMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
    const movementX = Math.abs(fromPosition.x - toPosition.x);
    const movementY = Math.abs(fromPosition.y - toPosition.y);

    //Check the king is not moving into check.

    if (movementX <= 1 && movementY <= 1) {
        return true;
    }
    return false;
}