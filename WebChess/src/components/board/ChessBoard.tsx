import React, { useCallback, useEffect } from 'react';
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
import { isTurn } from '../rules/IsTurn';

const ChessBoard: React.FC = () => {

    const [pieces, setPieces] = useState<Piece[]>([]);
    const params = useParams();

    useEffect(() => {
        const pieces: Piece[] = [];
        let fenString = params.fen

        if (!fenString) { 
            fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" 
            sessionStorage.setItem("turn", "white")
            sessionStorage.setItem("castling", "KQkq")
        }


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

    // function convertToChessPosition(position: Position): string {
    //     const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    //     const x = position.x;
    //     const y = 7 - position.y; // Invert y-coordinate to match chessboard orientation
    //     const letter = letters[x];
    //     const number = y + 1;

    //     return `${letter}${number}`;
    // }

    function castleKingSide(y: number, prevPieces: Piece[]): boolean {
        const kingSidePieceInWay = prevPieces.find(piece =>
            piece.position.x === 5 && piece.position.y === y);
        const kingSidePieceInWayTwo = prevPieces.find(piece =>
            piece.position.x === 6 && piece.position.y === y);
        if (kingSidePieceInWay || kingSidePieceInWayTwo) {
            return false;
        }
        return true;
    }

    function castleQueenSide(y: number, prevPieces: Piece[]): boolean {
        const kingSidePieceInWay = prevPieces.find(piece =>
            piece.position.x === 1 && piece.position.y === y);
        const kingSidePieceInWayTwo = prevPieces.find(piece =>
            piece.position.x === 2 && piece.position.y === y);
        const kingSidePieceInWayThree = prevPieces.find(piece =>
            piece.position.x === 3 && piece.position.y === y);
        if (kingSidePieceInWay || kingSidePieceInWayTwo || kingSidePieceInWayThree) {
            return false;
        }
        return true;
    }

    function toggleTurn() {
        let currentPlayerColor = sessionStorage.getItem('turn');
        if (currentPlayerColor === 'white') {
            sessionStorage.setItem('turn', 'black');
        } else {
            sessionStorage.setItem('turn', 'white');
        }
    }

    const handleDrop = (fromPosition: Position, toPosition: Position) => {
        setPieces((prevPieces) => {

            if (fromPosition.x === toPosition.x && fromPosition.y === toPosition.y) {
                return prevPieces;
            }

            const pieceFromPosition = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y
            );

            const pieceAtPosition = prevPieces.find(piece =>
                piece.position.x === toPosition.x && piece.position.y === toPosition.y
            );

            if (!pieceFromPosition) {
                return prevPieces;
            }

            if (!isTurn(pieceFromPosition)) {
                return prevPieces;
            }

            //Castling rules King moves two squares right or left and then rook comes to the side of the king
            //Cant castle after kind moved
            //Cant castly in directon of rook if rook moved
            //Cant castly in / through / into check
            //No pieces inbetween the king and the rook

            let castling = sessionStorage.getItem("castling")
            if (castling?.includes("K") && pieceFromPosition.type === PieceType.KingWhite && (toPosition.y === 7 && toPosition.x === 6)) {
                if(castleKingSide(7, prevPieces)){
                    let castledWhiteKingSide = prevPieces.map(piece => {
                        if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                            return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                        } else if (piece.position.x === 7 && piece.position.y === 7) {
                            // Handle moving the rook
                            return { ...piece, position: { x: 5, y: 7 } }; // Assuming the rook's new position after castling is (5, 7)
                        }
                        return piece;
                    });
                    toggleTurn();
                    return castledWhiteKingSide;
                }
            }
            else if (castling?.includes("k") && pieceFromPosition.type === PieceType.KingBlack && (toPosition.y === 0 && toPosition.x === 6)) {
                if (castleKingSide(0, prevPieces)) {
                    let castledBlackKingSide = prevPieces.map(piece => {
                        if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                            return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                        } else if (piece.position.x === 7 && piece.position.y === 0) {
                            // Handle moving the rook
                            return { ...piece, position: { x: 5, y: 0 } }; // Assuming the rook's new position after castling is (5, 7)
                        }
                        return piece;
                    });
                    toggleTurn();
                    return castledBlackKingSide;
                }
            }
            else if (castling?.includes("Q") && pieceFromPosition.type === PieceType.KingWhite && (toPosition.y === 7 && toPosition.x === 2)) {
                if (castleQueenSide(7, prevPieces)) {
                    let castledWhiteQueenSide = prevPieces.map(piece => {
                        if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                            return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                        } else if (piece.position.x === 0 && piece.position.y === 7) {
                            // Handle moving the rook
                            return { ...piece, position: { x: 3, y: 7 } }; // Assuming the rook's new position after castling is (5, 7)
                        }
                        return piece;
                    });
                    toggleTurn();
                    return castledWhiteQueenSide;
                }
            }
            else if (castling?.includes("q") && pieceFromPosition.type === PieceType.KingBlack && (toPosition.y === 0 && toPosition.x === 2)){
                if (castleQueenSide(0, prevPieces)) {
                    let castledBlackQueenSide = prevPieces.map(piece => {
                        if (piece.position.x === fromPosition.x && piece.position.y === fromPosition.y) {
                            return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
                        } else if (piece.position.x === 0 && piece.position.y === 0) {
                            // Handle moving the rook
                            return { ...piece, position: { x: 3, y: 0 } }; // Assuming the rook's new position after castling is (5, 7)
                        }
                        return piece;
                    });
                    toggleTurn();
                    return castledBlackQueenSide;
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

            toggleTurn();

            return updatedPieces;
        });
    };

    const renderTile = (position: Position, postionName: string, color: 'white' | 'black') => {
        const piece = pieces.find(piece => piece.position.x === position.x && piece.position.y === position.y);
        return (
            <ChessTile position={position} positionName={postionName} color={color} onDrop={handleDrop}>
                {piece && <DraggablePiece type={piece.type} position={piece.position} /> }
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