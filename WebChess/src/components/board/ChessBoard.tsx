import React, { useEffect } from 'react';
import ChessTile from './DroppableSquare';
import { Position } from '../utils/Position';
import { useState } from 'react';
import DraggablePiece from '../pieces/DraggablePiece';
import { PieceType } from '../pieces/PieceType';
import { Piece } from '../pieces/Piece';

const ChessBoard: React.FC = () => {

    type Pieces = {
        [key: string]: Piece;
    };

    const initialPieces: Pieces = {
        'a8': { type: PieceType.RookBlack, position: { x: 0, y: 0 } },
        'a1': { type: PieceType.RookWhite, position: { x: 0, y: 7 } },
    };

    const [pieces, setPieces] = useState<Pieces>({});

    useEffect(() => {
    setPieces(initialPieces);
}, []);

    // function assignPiecesFEN(fen: string) {
    //     const fenBoardSplit = fen.split(' ')[0];
    //     const fenBoard = fenBoardSplit.replace(/\//g, "");
    //     const pieces: any = [];

    //     let emptyCounter = 0;
    //     for (let i = 0; i < fenBoard.length; i++) {
    //         if (!isNaN(Number(fenBoard[i]))) {
    //             emptyCounter = emptyCounter + (Number(fenBoard[i]) - 1);
    //         }
    //         else {
                
    //         }
    //     }
    //     return pieces;
    // }

    // const renderTile = (position: Position, postionName: string, color: 'white' | 'black') => (
    //     <ChessTile position={position} positionName={postionName} color={color} onDrop={onDrop} />
    // );

    function convertToChessPosition(position: Position): string {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const x = position.x;
        const y = 7 - position.y; // Invert y-coordinate to match chessboard orientation
        const letter = letters[x];
        const number = y + 1;

        return `${letter}${number}`;
    }

    const handleDrop = (fromPosition: Position, toPosition: Position) => {
        setPieces((prevPieces) => {
            const piece = prevPieces[convertToChessPosition(fromPosition)];
            if (!piece) return prevPieces;

            const newPieces = { ...prevPieces };
            delete newPieces[convertToChessPosition(fromPosition)];
            newPieces[convertToChessPosition(toPosition)] = piece;

            console.log('New Pieces State:', newPieces); // Debugging line

            return newPieces;
        });
    };


    const renderTile = (position: Position, postionName: string, color: 'white' | 'black') => {
        const piece = pieces[postionName];
        return (
            <ChessTile position={position} positionName={postionName} color={color} onDrop={handleDrop}>
                {piece && <DraggablePiece type={piece.type} position={piece.position} />}
            </ChessTile>
        );
    };

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
        console.log(pieces)
        return tiles;
    };

    return (
        <div className='chessboard'>
            {renderBoard()}
        </div>
    );
};

export default ChessBoard;