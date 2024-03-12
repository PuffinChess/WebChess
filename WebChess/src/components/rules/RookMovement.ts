import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";

export function isLegalRookMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
    const movementX = Math.abs(fromPosition.x - toPosition.x);
    const movementY = Math.abs(fromPosition.y - toPosition.y);

    if (0 === movementX || 0 === movementY) {
        return true;
    } else {
        return false
    }

}