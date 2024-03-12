import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";

export function isLegalQueenMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
    const movementX = Math.abs(fromPosition.x - toPosition.x);
    const movementY = Math.abs(fromPosition.y - toPosition.y);

    if ((0 === movementX || 0 === movementY) || (movementX === movementY)) {
        return true;
    }
    return false;
}