import { PieceType } from "./PieceType";

export function getPieceType(value: string): PieceType | undefined {
    switch (value) {
        case "p":
            return PieceType.PawnBlack;
        case "r":
            return PieceType.RookBlack;
        case "n":
            return PieceType.KnightBlack;
        case "b":
            return PieceType.BishopBlack;
        case "q":
            return PieceType.QueenBlack;
        case "k":
            return PieceType.KingBlack;
        case "P":
            return PieceType.PawnWhite;
        case "R":
            return PieceType.RookWhite;
        case "N":
            return PieceType.KnightWhite;
        case "B":
            return PieceType.BishopWhite;
        case "Q":
            return PieceType.QueenWhite;
        case "K":
            return PieceType.KingWhite;
        default:
            return undefined; // Handle invalid values gracefully
    }
}