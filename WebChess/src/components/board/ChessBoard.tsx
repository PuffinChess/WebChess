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
import { isTurn } from '../rules/IsTurn';
import { performCastling } from '../rules/PerformCastling';

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
            sessionStorage.setItem("enpassant", "")
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

    //Switches between white turn and black turn
    function toggleTurn() {
        let currentPlayerColor = sessionStorage.getItem('turn');
        if (currentPlayerColor === 'white') {
            sessionStorage.setItem('turn', 'black');
        } else {
            sessionStorage.setItem('turn', 'white');
        }
    }

    //Removes right for certain types of castling depending on piece movement //Could move to different file
    function castlingRightsUpdater(pieceFromPosition: Piece, castling: string, fromPosition: Position) {
        switch (pieceFromPosition.type) {
            case PieceType.KingWhite:
                if (castling.includes("K") || castling.includes("Q")) {
                    castling = castling.replace(/[KQ]/g, '');
                }
                break;
            case PieceType.KingBlack:
                if (castling.includes("k") || castling.includes("q")) {
                    castling = castling.replace(/[kq]/g, '');
                }
                break;
            case PieceType.RookWhite:
                if (castling.includes("K") && fromPosition.x === 7 && fromPosition.y === 7) {
                    castling = castling.replace(/[K]/g, '');
                }
                else if (castling.includes("Q") && fromPosition.x === 0 && fromPosition.y === 7) {
                    castling = castling.replace(/[Q]/g, '');
                }
                break;
            case PieceType.RookBlack:
                if (castling.includes("k") || castling.includes("q")) {
                    if (fromPosition.x === 0 && fromPosition.y === 0) {
                        castling = castling.replace(/[q]/g, '');
                    } else if (fromPosition.x === 7 && fromPosition.y === 0) {
                        castling = castling.replace(/[k]/g, '');
                    }
                }
                break;
            default:
                break;
        }
        sessionStorage.setItem("castling", castling);
    }

    //En passant updater
    function isEnpassantableCheck(fromY: number, toY: number, toX: number) {
        if (Math.abs(fromY - toY) == 2) {
            sessionStorage.setItem("enpassant", `${toX}${toY}`)
        }
        else {
            sessionStorage.setItem("enpassant", ``)
        }
    }

    //Handle drop of pieces
    const handleDrop = (fromPosition: Position, toPosition: Position) => {
        //On piece move checks for chess rules for legality of the move.
        setPieces((prevPieces) => {

            if (fromPosition.x === toPosition.x && fromPosition.y === toPosition.y) {
                return prevPieces;
            }

            const pieceFromPosition = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y
            );

            if (!pieceFromPosition) {
                return prevPieces;
            }

            if (!isTurn(pieceFromPosition)) {
                return prevPieces;
            }

            let castling = sessionStorage.getItem("castling")
            if (castling && castling.length > 0) {
                const castlingResult = performCastling(castling, pieceFromPosition, toPosition, fromPosition, prevPieces);
                if (castlingResult) {
                    toggleTurn();
                    return castlingResult;
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

            const pieceAtPosition = prevPieces.find(piece =>
                piece.position.x === toPosition.x && piece.position.y === toPosition.y
            );

            //need to do an enpassant check
            let pieceEnpassantPosition: Piece;
            const enpassant = sessionStorage.getItem("enpassant");
            if (enpassant && enpassant.length > 0) {
                const x: number = parseInt(enpassant[0]);
                const y: number = parseInt(enpassant[1]);

                const pieceEnpassantPositionTemp = prevPieces.find(piece =>
                    piece.position.x === x && piece.position.y === y
                );

                if (pieceEnpassantPositionTemp) {
                    pieceEnpassantPosition = pieceEnpassantPositionTemp;
                }
            }

            // Checks if there is a piece at the location and filter it out if captured
            if (pieceAtPosition && pieceFromPosition) {
                if (isLowerCase(pieceAtPosition.type) !== isLowerCase(pieceFromPosition.type)) {
                    updatedPieces = updatedPieces.filter(obj => obj.position !== pieceAtPosition.position);
                } else {
                    return prevPieces;
                }
            } else if (!pieceAtPosition && pieceFromPosition && pieceEnpassantPosition && ) {
                updatedPieces = updatedPieces.filter(obj => obj.position !== pieceEnpassantPosition.position);
            }

            if (!(pieceFromPosition.type === PieceType.KingBlack || pieceFromPosition.type === PieceType.KingWhite) && InCheck(pieceFromPosition.type, updatedPieces)) {
                return prevPieces;
            }

            if (castling) {
                castlingRightsUpdater(pieceFromPosition, castling, fromPosition);
            }

            if (pieceFromPosition.type == PieceType.PawnBlack || PieceType.PawnWhite) {
                isEnpassantableCheck(fromPosition.y, toPosition.y, toPosition.x)
            } else {
                sessionStorage.setItem("enpassant", ``)
            }

            toggleTurn();

            return updatedPieces;
        });
    };

    //Render chess tile with/without piece
    const renderTile = (position: Position, postionName: string, color: 'white' | 'black') => {
        const piece = pieces.find(piece => piece.position.x === position.x && piece.position.y === position.y);
        return (
            <ChessTile position={position} positionName={postionName} color={color} onDrop={handleDrop}>
                {piece && <DraggablePiece type={piece.type} position={piece.position} />}
            </ChessTile>
        );
    };

    //Render chess board
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