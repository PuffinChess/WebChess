import React, { useEffect } from 'react';
import ChessTile from './DroppableSquare';
import { Position } from '../utils/Position';
import { useState } from 'react';
import DraggablePiece from '../pieces/DraggablePiece';
import { PieceType } from '../pieces/PieceType';
import { Piece } from '../pieces/Piece';
import { useParams } from 'react-router-dom';
import { getPieceType } from '../pieces/GetPieceType';
import { isPieceMovementLegal } from '../rules/Movement';
import { InCheck } from '../rules/InCheck';
import { isLowerCase } from '../utils/IsLowerCase';

const ChessBoard: React.FC = () => {

    const [pieces, setPieces] = useState<Piece[]>([]);
    const [castlingRights, setCastlingRights] = useState({
        whiteShort: true,
        whiteLong: true,
        blackShort: true,
        blackLong: true
    });
    const params = useParams();

    useEffect(() => {
        const pieces: Piece[] = [];
        let fenString = params.fen

        if (!fenString) { fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }

        const fenBoardSplit = fenString.split(' ')[0];
        const fenBoard = fenBoardSplit.replace(/\//g, "");

        let i = 0;
        for (let y = 0; y < 8; y++) {
            let counter = 0;
            for (let x = 0; x < 8; x++) {
                if (counter > 0) {
                    counter--;
                }
                else if (!isNaN(Number(fenBoard[i]))) {
                    counter = counter + (Number(fenBoard[i]) - 1);
                    i++
                }
                else {
                    const pieceType = getPieceType(fenBoard[i]);
                    if (pieceType !== undefined) {
                        pieces.push({ type: pieceType, position: { x: x, y: y } });
                        i++
                    }
                }
            }
        }
        setPieces(pieces);
    }, []);

    function castlingCheck(pieceFromPosition: Piece, toPosition: Position) {
        //Castling check

    }

    // function convertToChessPosition(position: Position): string {
    //     const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    //     const x = position.x;
    //     const y = 7 - position.y; // Invert y-coordinate to match chessboard orientation
    //     const letter = letters[x];
    //     const number = y + 1;

    //     return `${letter}${number}`;
    // }

    const handleDrop = (fromPosition: Position, toPosition: Position) => {
        setPieces((prevPieces) => {

            if (fromPosition.x === toPosition.x && fromPosition.y === toPosition.y) {
                return prevPieces;
            }

            const pieceAtPosition = prevPieces.find(piece =>
                piece.position.x === toPosition.x && piece.position.y === toPosition.y
            );

            const pieceFromPosition = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y
            );


            if (!pieceFromPosition) {
                return prevPieces;
            }

            if (Object.values(castlingRights).some(val => val === true)){
                if (castlingRights.whiteShort && pieceFromPosition.type == PieceType.KingWhite && (toPosition.y === 7 && toPosition.x === 6)) {
                    //check if pieces in the way

                }
                else if (castlingRights.blackShort && pieceFromPosition.type == PieceType.KingBlack && (toPosition.y === 0 && toPosition.x === 6)) {
                    //check if pieces in the way
                    //perform moves
                }
                else if (castlingRights.whiteLong && pieceFromPosition.type == PieceType.KingWhite && (toPosition.y === 7 && toPosition.x === 2)) {
                    //check if pieces in the way
                    //perform moves
                }
                else if (castlingRights.blackLong && pieceFromPosition.type == PieceType.KingWhite && (toPosition.y === 7 && toPosition.x === 2)) {
                    //check if pieces in the way
                    //perform moves
                }
            }

            if (!isPieceMovementLegal(pieceFromPosition, fromPosition, toPosition, prevPieces)) {
                return prevPieces;
            }

            // Create a new array with updated positions
            let updatedPieces = prevPieces.map(piece => {
                if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                    return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                }
                return piece;
            });

            // Checks if there is a piece at the location and filter it out if captured
            if (pieceAtPosition && pieceFromPosition) {
                if (isLowerCase(pieceAtPosition.type) !== isLowerCase(pieceFromPosition.type)) {
                    updatedPieces = updatedPieces.filter(obj => obj.position !== pieceAtPosition.position);
                } else {
                    return prevPieces;
                }
            }

            if (!(pieceFromPosition.type === PieceType.KingBlack || pieceFromPosition.type === PieceType.KingWhite) && InCheck(pieceFromPosition.type, updatedPieces)) {
                return prevPieces;
            }

            return updatedPieces;
        });
    };

    const renderTile = (position: Position, postionName: string, color: 'white' | 'black') => {
        const piece = pieces.find(piece => piece.position.x === position.x && piece.position.y === position.y);
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
                const position = { x, y }
                const postionName = String.fromCharCode(97 + x) + (8 - y).toString();
                const color = (y + x) % 2 !== 0 ? "black" : "white";
                tiles.push(renderTile(position, postionName, color));
            }
        }
        return tiles;
    };

    return (
        <div className='chessboard'>
            {renderBoard()}
        </div>
    );
};

export default ChessBoard;