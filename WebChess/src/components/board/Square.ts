import { Position } from "../utils/Position";
import { ReactNode } from "react";

export interface ChessTileProps {
    position: Position;
    positionName: String;
    color: 'white' | 'black';
    children: ReactNode;
    onDrop: (fromPosition: Position, toPosition: Position) => void;
}