import { Piece } from "../pieces/Piece";
import { isLowerCase } from "../utils/IsLowerCase";

export function isTurn(pieceFromPosition: Piece, whiteTurn: Boolean): Boolean {
    console.log(whiteTurn)
    console.log(pieceFromPosition.type);
    console.log(pieceFromPosition.type.toUpperCase())
    console.log(pieceFromPosition.type.toLowerCase())
    if (!isLowerCase(pieceFromPosition.type) && whiteTurn) {
        return true;
    }
    else if (isLowerCase(pieceFromPosition.type) && !whiteTurn){
        return true;
    }
    return false;
}