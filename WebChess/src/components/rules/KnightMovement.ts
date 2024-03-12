import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";

export function isLegalKnightMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
    const movementX = Math.abs(fromPosition.x - toPosition.x);
    const movementY = Math.abs(fromPosition.y - toPosition.y);

    if ((movementX === 2 && movementY === 1) || (movementX === 1 && movementY === 2)) {
        return true;
    }
    return false;
}