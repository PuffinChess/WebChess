import { Position } from "../utils/Position";

export interface ChessTileProps {
    position: Position;
    positionName: String;
    color: 'white' | 'black';
    onDrop: (fromPosition: Position, toPosition: Position) => void;
}