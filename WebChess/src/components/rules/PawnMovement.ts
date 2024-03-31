import { Position } from "../utils/Position";
import { Piece } from "../pieces/Piece";
import { PieceType } from "../pieces/PieceType";

export function isLegalPawnMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[], pawn: Piece): boolean {
    const movementX = fromPosition.x - toPosition.x;
    const movementY = fromPosition.y - toPosition.y;


    switch (pawn.type) {
        case PieceType.PawnWhite: {
            const pieceOneAhead = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y - 1)

            const pieceTwoAhead = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y - 2)

            const capture = prevPieces.find(piece =>
                piece.position.x === toPosition.x && piece.position.y === toPosition.y)

            let enpassantCapture = false;
            const enpassant = sessionStorage.getItem("enpassant");
            if (enpassant && enpassant.length > 0) {
                const x: number = parseInt(enpassant[0]);
                const y: number = parseInt(enpassant[1]);

                if (x === toPosition.x && y === toPosition.y + 1) {
                    enpassantCapture = true;
                } 
            }

            if (movementX === 0 && movementY === 1 && !pieceOneAhead) {
                return true;
            }
            else if (movementX === 0 && movementY === 2 && fromPosition.y === 6 && !pieceOneAhead && !pieceTwoAhead) {
                return true;
            }
            else if (movementX === 1 && movementY === 1 && (capture || enpassantCapture)) {
                return true
            }
            else if (movementX === -1 && movementY === 1 && (capture || enpassantCapture)) {
                return true
            }
            return false;
        }
        case PieceType.PawnBlack: {
            const pieceOneAhead = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y + 1);

            const pieceTwoAhead = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y + 2);

            const capture = prevPieces.find(piece =>
                piece.position.x === toPosition.x && piece.position.y === toPosition.y);

            let enpassantCapture = false;
            const enpassant = sessionStorage.getItem("enpassant");
            if (enpassant && enpassant.length > 0) {
                const x: number = parseInt(enpassant[0]);
                const y: number = parseInt(enpassant[1]);

                if (x === toPosition.x && y === toPosition.y - 1) {
                    enpassantCapture = true;
                }
            }

            if (movementX === 0 && movementY === -1 && !pieceOneAhead) {
                return true;
            }
            else if (movementX === 0 && movementY === -2 && fromPosition.y === 1 && !pieceOneAhead && !pieceTwoAhead) {
                return true;
            }
            else if (movementX === 1 && movementY === -1 && (capture || enpassantCapture)) {
                return true
            }
            else if (movementX === -1 && movementY === -1 && (capture || enpassantCapture)) {
                return true
            }
            return false;
        }
    }
    return false;
}