import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";

export function isLegalBishopMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
    const movementX = fromPosition.x - toPosition.x;
    const movementY = fromPosition.y - toPosition.y;

    if (Math.abs(movementX) === Math.abs(movementY)) {

        for (let i = 1; i < Math.abs(movementX); i++) {
            const piece = prevPieces.find(piece =>
                piece.position.x === fromPosition.x - (i * Math.sign(movementX)) && piece.position.y === fromPosition.y - (i * Math.sign(movementY)))
            if (piece) {
                return false;
            }
        }
        return true;
    }
    return false;
}
