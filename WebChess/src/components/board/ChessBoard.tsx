import React from 'react';
import ChessTile from './DroppableSquare';
import { Position } from '../utils/Position';

interface ChessboardProps {
    onDrop: (fromPosition: Position, toPosition: Position) => void;
}

const ChessBoard: React.FC<ChessboardProps> = ({ onDrop }) => {

    const renderTile = (position: Position, postionName: string, color: 'white' | 'black') => (
        <ChessTile position={position} positionName={postionName} color={color} onDrop={onDrop} />
    );

    const renderBoard = () => {
        const tiles = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const position = {x, y}
                const postionName = String.fromCharCode(97 + x) + (8 - y).toString();
                const color = (y + x) % 2 !== 0 ? "black" : "white";
                tiles.push(renderTile(position, postionName, color));
            }
        }
        console.log(tiles);
        return tiles;
    };

    return (
        <div className='chessboard'>
            {renderBoard()}
        </div>
    );
};

export default ChessBoard;