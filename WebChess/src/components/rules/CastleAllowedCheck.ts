import { Piece } from "../pieces/Piece";
import { PieceType } from "../pieces/PieceType";
import { InCheckAtPosition } from "./InCheckAtPosition";
import { Position } from "../utils/Position";

export function castleKingSide(y: number, prevPieces: Piece[]): boolean {

    const kingSidePieceInWay = prevPieces.find(piece =>
        piece.position.x === 5 && piece.position.y === y);
    const kingSidePieceInWayTwo = prevPieces.find(piece =>
        piece.position.x === 6 && piece.position.y === y);

    if (kingSidePieceInWay || kingSidePieceInWayTwo) {    
        return false;
    }

    let king: PieceType;
    let position1: Position = { x: 4, y: y }
    let position2: Position = { x: 5, y: y }
    let position3: Position = { x: 6, y: y }
    if (y === 0) { // Fixed the comparison operator here
        king = PieceType.KingBlack
    }
    else {
        king = PieceType.KingWhite
    }
    if (InCheckAtPosition(king, position1, prevPieces) || InCheckAtPosition(king, position3, prevPieces) || InCheckAtPosition(king, position2, prevPieces)) {
        return false
    }

    return true;
}

export function castleQueenSide(y: number, prevPieces: Piece[]): boolean {
    const kingSidePieceInWay = prevPieces.find(piece =>
        piece.position.x === 1 && piece.position.y === y);
    const kingSidePieceInWayTwo = prevPieces.find(piece =>
        piece.position.x === 2 && piece.position.y === y);
    const kingSidePieceInWayThree = prevPieces.find(piece =>
        piece.position.x === 3 && piece.position.y === y);
    if (kingSidePieceInWay || kingSidePieceInWayTwo || kingSidePieceInWayThree) {
        return false;
    }

    let king: PieceType;
    let position1: Position = { x: 4, y: y }
    let position2: Position = { x: 3, y: y }
    let position3: Position = { x: 2, y: y }
    if (y === 0) { // Fixed the comparison operator here
        king = PieceType.KingBlack
    }
    else {
        king = PieceType.KingWhite
    }
    if (InCheckAtPosition(king, position1, prevPieces) || InCheckAtPosition(king, position3, prevPieces) || InCheckAtPosition(king, position2, prevPieces)) {
        return false
    }

    return true;
}