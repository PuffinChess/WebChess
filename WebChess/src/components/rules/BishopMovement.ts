import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";

export function isLegalBishopMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
    const movementX = Math.abs(fromPosition.x - toPosition.x);
    const movementY = Math.abs(fromPosition.y - toPosition.y);

    if (movementX === movementY) {
        return true;
    }
    return false;
}
