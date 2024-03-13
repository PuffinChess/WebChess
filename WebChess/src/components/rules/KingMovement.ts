import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";
import { InCheck } from "./InCheck";
import { isLowerCase } from "../utils/IsLowerCase";

export function isLegalKingMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
    const movementX = Math.abs(fromPosition.x - toPosition.x);
    const movementY = Math.abs(fromPosition.y - toPosition.y);

    let future = prevPieces.slice(); // Create a shallow copy of prevPieces

    if (movementX <= 1 && movementY <= 1) {
        const pieceFromPosition = future.find(piece =>
            piece.position.x === fromPosition.x && piece.position.y === fromPosition.y);
        const pieceAtPosition = future.find(piece =>
            piece.position.x === toPosition.x && piece.position.y === toPosition.y);

        if (pieceAtPosition && pieceFromPosition) {
            if (isLowerCase(pieceAtPosition.type) !== isLowerCase(pieceFromPosition.type)) {
                future = future.filter(obj => obj.position !== pieceAtPosition.position).slice(); // Filter and create a copy
            } else {
                return false;
            }
        }

        // Create a new array with modified positions
        const updatedPieces = future.map(piece => {
            if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
            }
            return piece;
        });

        if (pieceFromPosition && !InCheck(pieceFromPosition.type, updatedPieces)) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}