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
import { castlingRightsUpdater } from '../rules/CastlingRightsUpdater';
import PromotionSelection from './PromotionSelector';

const ChessBoard: React.FC = () => {

    const [pieces, setPieces] = useState<Piece[]>([]);
    const params = useParams();
    const [isPromotionActive, setIsPromotionActive] = useState(false);

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

    //En passant updater
    function isEnpassantableCheck(fromY: number, toY: number, toX: number) {
        if (Math.abs(fromY - toY) == 2) {
            sessionStorage.setItem("enpassant", `${toX}${toY}`)
        }
        else {
            sessionStorage.setItem("enpassant", ``)
        }
    }

    const handlePawnPromotion = (piece: string) => {
        setPieces((prevPieces) => {
            const blackPawn = prevPieces.find(piece =>
                piece.type === PieceType.PawnBlack && piece.position.y === 7
            );

            const whitePawn = prevPieces.find(piece =>
                piece.type === PieceType.PawnWhite && piece.position.y === 0
            );

            let promotion: PieceType;

            if (whitePawn){
                switch(piece) {
                    case "queen": 
                        promotion = PieceType.QueenWhite
                        break;
                    case "rook": 
                        promotion = PieceType.RookWhite
                        break;
                    case "bishop":
                        promotion = PieceType.BishopWhite
                        break; 
                    case "knight": 
                        promotion = PieceType.KnightWhite
                        break;
                    default:
                        console.log("didntwork");
                        return prevPieces;
                }    
                let updatedPieces = prevPieces.map(piece => {
                    if (piece.position.x === whitePawn.position.x && piece.position.y === whitePawn.position.y) {
                        return { ...piece, type: promotion }; // Create a new object with updated position
                    }
                    return piece;
                });

                sessionStorage.setItem('turn', 'black');
                return updatedPieces;
            }
            else if (blackPawn){ 
                switch(piece) {
                    case "queen": 
                        promotion = PieceType.QueenBlack
                        break;
                    case "rook": 
                        promotion = PieceType.RookBlack
                        break;
                    case "bishop":
                        promotion = PieceType.BishopBlack
                        break; 
                    case "knight": 
                        promotion = PieceType.KnightBlack
                        break;
                    default:
                        return prevPieces;
                }  

                let updatedPieces = prevPieces.map(piece => {
                    if (piece.position.x === blackPawn.position.x && piece.position.y === blackPawn.position.y) {
                        return { ...piece, type: promotion }; // Create a new object with updated position
                    }
                    return piece;
                });
                
                sessionStorage.setItem('turn', 'white');
                return updatedPieces;
            }
            
            return prevPieces;
        });

        setIsPromotionActive(false);
    };

    function pawnPromotion(){
        setIsPromotionActive(true);
    }

    //Handle drop of pieces
    const handleDrop = async (fromPosition: Position, toPosition: Position) => {
        
        //On piece move checks for chess rules for legality of the move.
        setPieces((prevPieces) => {

            //Verify that the move is a move not a drop back at the same spot.
            if (fromPosition.x === toPosition.x && fromPosition.y === toPosition.y) {
                return prevPieces;
            }

            //Get piece at location and check if there actually is one
            const pieceFromPosition = prevPieces.find(piece =>
                piece.position.x === fromPosition.x && piece.position.y === fromPosition.y
            );

            if (!pieceFromPosition) {
                return prevPieces;
            }

            //Check if it is the turn of the piece colour moved 
            if (!isTurn(pieceFromPosition)) {
                return prevPieces;
            }

            //Get castling string then see if the move performed was an attempted castle
            let castling = sessionStorage.getItem("castling")
            if (castling && castling.length > 0 && (pieceFromPosition.type === PieceType.KingBlack || pieceFromPosition.type === PieceType.KingWhite)) {
                const castlingResult = performCastling(castling, pieceFromPosition, toPosition, fromPosition, prevPieces);
                if (castlingResult) {
                    toggleTurn();
                    return castlingResult;
                }
            }

            //Check if the move attempted to be performed is a legal move.
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

            //Check if there is a piece at the position that was attempted to be moved to.
            const pieceAtPosition = prevPieces.find(piece =>
                piece.position.x === toPosition.x && piece.position.y === toPosition.y
            );

            const enpassant = sessionStorage.getItem("enpassant");
            // Checks if there is a piece at the location and filter it out if captured - if not checks if the piece was an enpassant move
            if (pieceAtPosition && pieceFromPosition) {
                //Check youre not capturing a piece of the same colour
                if (isLowerCase(pieceAtPosition.type) !== isLowerCase(pieceFromPosition.type)) {
                    updatedPieces = updatedPieces.filter(obj => obj.position !== pieceAtPosition.position);
                } else {
                    return prevPieces;
                }
            }
            else if (!pieceAtPosition && pieceFromPosition && enpassant && enpassant.length > 0 ) {
                const x: number = parseInt(enpassant[0]);
                const y: number = parseInt(enpassant[1]);
                console.log(x, y)
                if (x === toPosition.x && (pieceFromPosition.type === PieceType.PawnBlack && y === toPosition.y - 1) || (pieceFromPosition.type === PieceType.PawnWhite && y === toPosition.y + 1))  {
                    updatedPieces = updatedPieces.filter(obj => !(obj.position.x === x && obj.position.y === y));
                }               
            }

            if (InCheck(pieceFromPosition.type, updatedPieces)) {
                return prevPieces;
            }

            //Check if its castling and then perform
            if (castling) {
                castlingRightsUpdater(pieceFromPosition, castling, fromPosition);
            }

            //Check if it is Enpassant and then perform move
            if (pieceFromPosition.type == PieceType.PawnBlack || PieceType.PawnWhite) {
                isEnpassantableCheck(fromPosition.y, toPosition.y, toPosition.x)
            } else {
                sessionStorage.setItem("enpassant", ``)
            }

            //Made for pawn promotion
            if (pieceFromPosition.type === PieceType.PawnWhite && toPosition.y === 0) {
                //Promote White
                pawnPromotion();
            }
            else if (pieceFromPosition.type === PieceType.PawnBlack && toPosition.y === 7) {
                //Promote Black
                pawnPromotion();
            }
            else {
                toggleTurn();
            }

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
            {isPromotionActive && (
                <PromotionSelection onSelectPiece={handlePawnPromotion} />
            )}
        </div>
    );
};

export default ChessBoard;