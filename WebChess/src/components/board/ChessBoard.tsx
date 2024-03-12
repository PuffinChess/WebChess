import React, { useEffect } from 'react';
import ChessTile from './DroppableSquare';
import { Position } from '../utils/Position';
import { useState } from 'react';
import DraggablePiece from '../pieces/DraggablePiece';
import { PieceType } from '../pieces/PieceType';
import { Piece } from '../pieces/Piece';
import { useParams } from 'react-router-dom';
import { getPieceType } from '../pieces/GetPieceType';

const ChessBoard: React.FC = () => {

    const [pieces, setPieces] = useState<Piece[]>([]);
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
        console.log(pieces);

    }, []);

    // function convertToChessPosition(position: Position): string {
    //     const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    //     const x = position.x;
    //     const y = 7 - position.y; // Invert y-coordinate to match chessboard orientation
    //     const letter = letters[x];
    //     const number = y + 1;

    //     return `${letter}${number}`;
    // }

    function isLowerCase(letter: string): boolean{
        if (letter === letter.toLowerCase()){
            return true;
        }
        return false;
    }

    function isLegalRookMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
        const movementX = Math.abs(fromPosition.x - toPosition.x);
        const movementY = Math.abs(fromPosition.y - toPosition.y);
        
        if (0 === movementX || 0 === movementY) {
            return true;
        } else {
            return false
        }

    }

    function isLegalBishopMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
        const movementX = Math.abs(fromPosition.x - toPosition.x);
        const movementY = Math.abs(fromPosition.y - toPosition.y);

        if (movementX === movementY) {
            return true;
        }
        return false;
    }

    function isLegalKnightMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
        const movementX = Math.abs(fromPosition.x - toPosition.x);
        const movementY = Math.abs(fromPosition.y - toPosition.y);

        if ((movementX === 2 && movementY === 1) || (movementX === 1 && movementY === 2)) {
            return true;
        }
        return false;
    }

    function isLegalQueenMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
        const movementX = Math.abs(fromPosition.x - toPosition.x);
        const movementY = Math.abs(fromPosition.y - toPosition.y);

        if ((0 === movementX || 0 === movementY) || (movementX === movementY)) {
            return true;
        }
        return false;
    }

    function isLegalKingMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
        const movementX = Math.abs(fromPosition.x - toPosition.x);
        const movementY = Math.abs(fromPosition.y - toPosition.y);

        if (movementX <= 1 && movementY <= 1) {
            return true;
        }
        return false;
    }

    function isLegalPawnMovement(fromPosition: Position, toPosition: Position, prevPieces: Piece[]): boolean {
        const movementX = Math.abs(fromPosition.x - toPosition.x);
        const movementY = Math.abs(fromPosition.y - toPosition.y);

        if (movementX === 0) {
            return true;
        }
        return false;
    }

    const handleDrop = (fromPosition: Position, toPosition: Position) => {
        setPieces((prevPieces) => {

            const pieceAtPosition = prevPieces.find(piece =>
                piece.position.x === toPosition.x && piece.position.y === toPosition.y
            );

            const pieceFromPosition = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y
            );

            if (!pieceFromPosition) {
                return prevPieces;
            }



            switch (pieceFromPosition.type){
                case PieceType.RookBlack: {
                    if (!isLegalRookMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.RookBlack: {
                    if (!isLegalRookMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.BishopBlack: {
                    if (!isLegalBishopMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.BishopWhite: {
                    if (!isLegalBishopMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.KnightBlack: {
                    if (!isLegalKnightMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.KnightWhite: {
                    if (!isLegalKnightMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.QueenWhite: {
                    if (!isLegalQueenMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.QueenBlack: {
                    if (!isLegalQueenMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.KingBlack: {
                    if (!isLegalKingMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.KingWhite: {
                    if (!isLegalKingMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.PawnBlack: {
                    if (!isLegalPawnMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
                case PieceType.PawnWhite: {
                    if (!isLegalPawnMovement(fromPosition, toPosition, prevPieces)) {
                        return prevPieces;
                    }
                    break;
                }
            }
            //Check is piece movement legal
            //For bishops, rooks, queen => validate there is no pieces in the way along path of movement
            //For pawn, allow captures diagonally not forwards. 2 tile move as first move allowed of piece
            //



            //Checks if there is a piece at the location.
            if (pieceAtPosition && pieceFromPosition) {
                //If pieces of same colour return board without changes, else remove piece to be captured.
                if (isLowerCase(pieceAtPosition.type) !== isLowerCase(pieceFromPosition.type)){
                    prevPieces = prevPieces.filter(obj => obj.position !== pieceAtPosition.position);
                }
                else {
                    return prevPieces;
                }
            }

            //Update piece location and return new board state
            return prevPieces.map((piece) => {
                if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                    piece.position = toPosition;
                }
                return piece;
            });
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