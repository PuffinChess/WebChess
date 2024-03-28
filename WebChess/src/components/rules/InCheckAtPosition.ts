import { Piece } from "../pieces/Piece";
import { PieceType } from "../pieces/PieceType";
import { Position } from "../utils/Position";

export function InCheckAtPosition(piece: PieceType, position: Position, prevPieces: Piece[]): boolean {


    //check colour of piece moved
    if (piece.toUpperCase() === piece) {
        //White move
        const piecesCopy = prevPieces.slice();

        // Find the king in the copied array
        const kingWhite = piecesCopy.find(piece => piece.type === PieceType.KingWhite);

        if (!kingWhite) {
            return false;
        }
        
        const updatedKingWhite = {...kingWhite};

        updatedKingWhite.position = position

        //Check pawn attack
        let pawnRight = piecesCopy.find(piece =>
            piece.position.x === updatedKingWhite.position.x - 1 && piece.position.y === updatedKingWhite.position.y - 1)
        let pawnLeft = piecesCopy.find(piece =>
            piece.position.x === updatedKingWhite.position.x + 1 && piece.position.y === updatedKingWhite.position.y - 1)


        if ((pawnRight && pawnRight.type === PieceType.PawnBlack) || (pawnLeft && pawnLeft.type === PieceType.PawnBlack)) {
            return true;
        }

        //Check Diagonal attack (Queen, Bishop)
        for (let dx = -1; dx <= 1; dx += 2) { // Iterate over diagonals
            for (let dy = -1; dy <= 1; dy += 2) { // Iterate over diagonals
                let x = updatedKingWhite.position.x + dx;
                let y = updatedKingWhite.position.y + dy;

                // Keep going along the diagonal until you reach the edge of the board or another piece
                while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                    const pieceOnDiagonal = piecesCopy.find(piece =>
                        piece.position.x === x && piece.position.y === y);

                    if (pieceOnDiagonal) {
                        // If a piece is found on the diagonal, check if it's a black queen or black bishop
                        if (pieceOnDiagonal.type === PieceType.QueenBlack ||
                            pieceOnDiagonal.type === PieceType.BishopBlack) {
                            return true; // Found a diagonal attack by black queen or black bishop
                        }
                        break; // Stop search other piece found
                    }

                    // Move to the next square along the diagonal
                    x += dx;
                    y += dy;
                }
            }
        }

        // Check Horizontal and Vertical attack (Queen, Rook)
        for (let dy = -1; dy <= 1; dy += 2) { // Iterate over Y
            let x = updatedKingWhite.position.x;
            let y = updatedKingWhite.position.y + dy;

            while (y >= 0 && y < 8) {
                const pieceOnStraight = piecesCopy.find(piece =>
                    piece.position.x === x && piece.position.y === y);

                if (pieceOnStraight) {
                    if (pieceOnStraight.type === PieceType.QueenBlack ||
                        pieceOnStraight.type === PieceType.RookBlack) {
                        return true;
                    }
                    break; //Stop search other piece found on line
                }

                // Move to the next square along the straight
                y += dy;
            }
        }

        for (let dx = -1; dx <= 1; dx += 2) { // Iterate over Y
            let x = updatedKingWhite.position.x + dx;
            let y = updatedKingWhite.position.y;

            while (x >= 0 && x < 8) {
                const pieceOnStraight = piecesCopy.find(piece =>
                    piece.position.x === x && piece.position.y === y);

                if (pieceOnStraight) {
                    if (pieceOnStraight.type === PieceType.QueenBlack ||
                        pieceOnStraight.type === PieceType.RookBlack) {
                        return true;
                    }
                    break; //Stop search other piece found on line
                }

                // Move to the next square along the straight
                x += dx;
            }
        }

        //Check Knight Attack
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                if (Math.abs(dx * dy) === 2) { // Check if the move is L-shaped
                    const x = updatedKingWhite.position.x + dx;
                    const y = updatedKingWhite.position.y + dy;

                    if (!(x >= 8 || y >= 8 || x < 0 || y < 0)) {
                        const pieceKnightPosition = piecesCopy.find(piece =>
                            piece.position.x === x && piece.position.y === y);

                        if (pieceKnightPosition) {
                            if (pieceKnightPosition.type === PieceType.KnightBlack) {
                                return true;
                            }
                            break; //Stop search other piece found on line
                        }
                    }
                }
            }
        }

        //Check move does not put king inside of king range
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const x = updatedKingWhite.position.x + dx;
                const y = updatedKingWhite.position.y + dy;

                const pieceKingPosition = piecesCopy.find(piece =>
                    piece.position.x === x && piece.position.y === y);

                if (pieceKingPosition) {
                    if (pieceKingPosition.type === PieceType.KingBlack) {
                        return true;
                    }
                }
            }
        }
    }
    else if (piece.toLowerCase() === piece) {

        const piecesCopy = prevPieces.slice();

        //Black move
        const kingBlack = piecesCopy.find(piece => piece.type === PieceType.KingBlack);

        if (!kingBlack) {
            return false;
        }
        
        const updatedKingBlack = {...kingBlack};

        updatedKingBlack.position = position

        //Check pawn attack
        let pawnRight = piecesCopy.find(piece =>
            piece.position.x === updatedKingBlack.position.x - 1 && piece.position.y === updatedKingBlack.position.y + 1)
        let pawnLeft = piecesCopy.find(piece =>
            piece.position.x === updatedKingBlack.position.x + 1 && piece.position.y === updatedKingBlack.position.y + 1)


        if ((pawnRight && pawnRight.type === PieceType.PawnWhite) || (pawnLeft && pawnLeft.type === PieceType.PawnWhite)) {
            return true;
        }

        //Check Diagonal attack (Queen, Bishop)
        for (let dx = -1; dx <= 1; dx += 2) { // Iterate over diagonals
            for (let dy = -1; dy <= 1; dy += 2) { // Iterate over diagonals
                let x = updatedKingBlack.position.x + dx;
                let y = updatedKingBlack.position.y + dy;

                // Keep going along the diagonal until you reach the edge of the board or another piece
                while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                    const pieceOnDiagonal = piecesCopy.find(piece =>
                        piece.position.x === x && piece.position.y === y);

                    if (pieceOnDiagonal) {
                        // If a piece is found on the diagonal, check if it's a black queen or black bishop
                        if (pieceOnDiagonal.type === PieceType.QueenWhite ||
                            pieceOnDiagonal.type === PieceType.BishopWhite) {
                            return true; // Found a diagonal attack by black queen or black bishop
                        }
                        break; // Stop search other piece found
                    }

                    // Move to the next square along the diagonal
                    x += dx; 
                    y += dy;
                }
            }
        }

        // Check Horizontal and Vertical attack (Queen, Rook)
        for (let dy = -1; dy <= 1; dy += 2) { // Iterate over Y
            let x = updatedKingBlack.position.x;
            let y = updatedKingBlack.position.y + dy;

            while (y >= 0 && y < 8) {
                const pieceOnStraight = piecesCopy.find(piece =>
                    piece.position.x === x && piece.position.y === y);

                if (pieceOnStraight) {
                    if (pieceOnStraight.type === PieceType.QueenWhite ||
                        pieceOnStraight.type === PieceType.RookWhite) {
                        return true;
                    }
                    break; //Stop search other piece found on line
                }

                // Move to the next square along the straight
                y += dy;
            }
        }

        for (let dx = -1; dx <= 1; dx += 2) { // Iterate over Y
            let x = updatedKingBlack.position.x + dx;
            let y = updatedKingBlack.position.y;

            while (x >= 0 && x < 8) {
                const pieceOnStraight = piecesCopy.find(piece =>
                    piece.position.x === x && piece.position.y === y);

                if (pieceOnStraight) {
                    if (pieceOnStraight.type === PieceType.QueenWhite ||
                        pieceOnStraight.type === PieceType.RookWhite) {
                        return true;
                    }
                    break; //Stop search other piece found on line
                }

                // Move to the next square along the straight
                x += dx;
            }
        }

        //Check Knight Attack
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                if (Math.abs(dx) + Math.abs(dy) === 3) { // Correct condition for L-shaped move
                    const x = updatedKingBlack.position.x + dx;
                    const y = updatedKingBlack.position.y + dy;

                    if (!(x >= 8 || y >= 8 || x < 0 || y < 0)) {

                        const pieceKnightPosition = piecesCopy.find(piece =>
                            piece.position.x === x && piece.position.y === y);

                        if (pieceKnightPosition) {
                            if (pieceKnightPosition.type === PieceType.KnightWhite) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const x = updatedKingBlack.position.x + dx;
                const y = updatedKingBlack.position.y + dy;

                const pieceKingPosition = piecesCopy.find(piece =>
                    piece.position.x === x && piece.position.y === y);

                if (pieceKingPosition) {
                    if(pieceKingPosition.type === PieceType.KingWhite) {
                        return true;
                    }
                }
            }
        }

    }

    return false;
} 