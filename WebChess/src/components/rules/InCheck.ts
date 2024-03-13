import { Piece } from "../pieces/Piece";
import { PieceType } from "../pieces/PieceType";

export function InCheck(piece: PieceType, prevPieces: Piece[]): boolean {

    console.log(piece)

    //check colour of piece moved
    if (piece.toUpperCase() === piece) {
        //White move
        const kingWhite = prevPieces.find(piece =>
            piece.type === PieceType.KingWhite);

        if(!kingWhite) {
            return false;
        }

        //Check pawn attack
        let pawnRight = prevPieces.find(piece =>
            piece.position.x === kingWhite.position.x - 1 && piece.position.y === kingWhite.position.y - 1)
        let pawnLeft = prevPieces.find(piece =>
            piece.position.x === kingWhite.position.x + 1 && piece.position.y === kingWhite.position.y - 1)
    

        if ((pawnRight && pawnRight.type === PieceType.PawnBlack) || (pawnLeft && pawnLeft.type === PieceType.PawnBlack)) {
            return true;
        }

        //Check Diagonal attack (Queen, Bishop)
        //Check Line attack (Queen, Rook)
        //Check Knight Attack
        //Check move does not put king inside of king range
    }
    else if (piece.toLowerCase() === piece) {
        //Black move


    }
    else {
        return false;
    }

    //Check pawn attack


    //Check Diagonal attack (Queen, Bishop)
    //Check Line attack (Queen, Rook)
    //Check Knight Attack
    //Check move does not put king inside of king range

    return false;
} 