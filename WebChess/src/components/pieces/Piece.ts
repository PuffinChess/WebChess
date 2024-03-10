import { PieceType } from "./PieceType"
import { Position } from "../utils/Position";

export interface Piece {
    type: PieceType;
    position: Position;
}
