import React, { useEffect } from "react";
import ChessTile from "./DroppableSquare";
import { Position } from "../utils/Position";
import { useState } from "react";
import DraggablePiece from "../pieces/DraggablePiece";
import { PieceType } from "../pieces/PieceType";
import { Piece } from "../pieces/Piece";
import { useParams } from "react-router-dom";
import { getPieceType } from "../pieces/GetPieceType";
import { isPieceMovementLegal } from "../rules/Movement";
import { InCheck } from "../rules/InCheck";
import { isLowerCase } from "../utils/IsLowerCase";
import { isTurn } from "../rules/IsTurn";
import { performCastling } from "../rules/PerformCastling";
import { castlingRightsUpdater } from "../rules/CastlingRightsUpdater";
import PromotionSelection from "./PromotionSelector";
import { getBestMove, startNewGameUCI } from "../../api/UCI";
import { useNavigate } from "react-router-dom";

const ChessBoard: React.FC = () => {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const params = useParams();
  const [isPromotionActive, setIsPromotionActive] = useState(false);

  useEffect(() => {
    const pieces: Piece[] = [];
    let fenString = params.fen;
    let gameType = params.type;
    let colour = params.colour;
    let gameReady: Promise<Boolean>;

    async function gameStart() {
      if (gameType === "bot") {
        gameReady = startNewGameUCI();
      }

      if( !fenString ){
        fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        sessionStorage.setItem("turn", "white");
        sessionStorage.setItem("castling", "KQkq");
        sessionStorage.setItem("enpassant", "");
        sessionStorage.setItem("moves", "position startpos ");
      }

      const fenBoardSplit = fenString.split(" ")[0];
      const fenBoard = fenBoardSplit.replace(/\//g, "");

      let i = 0;
      for (let y = 0; y < 8; y++) {
        let counter = 0;
        for (let x = 0; x < 8; x++) {
          if (counter > 0) {
            counter--;
          } else if (!isNaN(Number(fenBoard[i]))) {
            counter = counter + (Number(fenBoard[i]) - 1);
            i++;
          } else {
            const pieceType = getPieceType(fenBoard[i]);
            if (pieceType !== undefined) {
              pieces.push({ type: pieceType, position: { x: x, y: y } });
              i++;
            }
          }
        }
      }

      setPieces(pieces);

      if (gameType === "bot") {
        if ((await gameReady) !== true) {
          alert("Couldnt Start Game");
          navigate("/");
        }

        if (colour) {
          sessionStorage.setItem("botColour", colour);
          if (colour === "white") {
            getBotMove();
          }
        }
      } else {
        sessionStorage.removeItem("botColour");
      }
    }

    gameStart();
  }, []);

  //Get move that the bot makes
  async function getBotMove() {
    //Call api
    let moves = sessionStorage.getItem("moves");

    if (moves !== null) {
      var botMove: Promise<string | null> = getBestMove(moves);

      await botMove.then((value) => {
        if (value !== null) {
          var positions: Position[] = convertToPosition(value.split(" ")[1]);

          handleDrop(positions[0], positions[1]);
        } else {
          alert("somthing went wrong");
        }
      });
    }
  }

  function convertToPosition(move: string): Position[] {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

    var moveFrom: string = move.slice(0, 2);
    var moveToo: string = move.slice(2, 4);

    var positionFrom: Position = {
      x: letters.findIndex((x) => x === move[0]),
      y: 8 - Number(move[1]),
    };
    var positionToo: Position = {
      x: letters.findIndex((x) => x === move[2]),
      y: 8 - Number(move[3]),
    };

    var positions: Position[] = [positionFrom, positionToo];
    console.log(positions);
    return positions;
  }

  //Switches between white turn and black turn
  function toggleTurn() {
    let botColour = sessionStorage.getItem("botColour");
    let currentPlayerColor = sessionStorage.getItem("turn");
    if (currentPlayerColor === "white") {
      currentPlayerColor = "black";
      sessionStorage.setItem("turn", "black");
    } else {
      currentPlayerColor = "white";
      sessionStorage.setItem("turn", "white");
    }

    if (botColour) {
      //Checking if its the bots turn
      if (
        botColour === currentPlayerColor ||
        botColour === currentPlayerColor
      ) {
        getBotMove();
      }
    }
  }

  //En passant updater
  function isEnpassantableCheck(fromY: number, toY: number, toX: number) {
    if (Math.abs(fromY - toY) == 2) {
      sessionStorage.setItem("enpassant", `${toX}${toY}`);
    } else {
      sessionStorage.setItem("enpassant", ``);
    }
  }

  const handlePawnPromotion = (piece: string) => {
    setPieces((prevPieces) => {
      const blackPawn = prevPieces.find(
        (piece) => piece.type === PieceType.PawnBlack && piece.position.y === 7
      );

      const whitePawn = prevPieces.find(
        (piece) => piece.type === PieceType.PawnWhite && piece.position.y === 0
      );

      let promotion: PieceType;

      if (whitePawn) {
        switch (piece) {
          case "Queen":
            promotion = PieceType.QueenWhite;
            break;
          case "Rook":
            promotion = PieceType.RookWhite;
            break;
          case "Bishop":
            promotion = PieceType.BishopWhite;
            break;
          case "Knight":
            promotion = PieceType.KnightWhite;
            break;
          default:
            console.log("didntwork");
            return prevPieces;
        }
        let updatedPieces = prevPieces.map((piece) => {
          if (
            piece.position.x === whitePawn.position.x &&
            piece.position.y === whitePawn.position.y
          ) {
            return { ...piece, type: promotion }; // Create a new object with updated position
          }
          return piece;
        });

        sessionStorage.setItem("turn", "black");
        return updatedPieces;
      } else if (blackPawn) {
        switch (piece) {
          case "Queen":
            promotion = PieceType.QueenBlack;
            break;
          case "Rook":
            promotion = PieceType.RookBlack;
            break;
          case "Bishop":
            promotion = PieceType.BishopBlack;
            break;
          case "Knight":
            promotion = PieceType.KnightBlack;
            break;
          default:
            return prevPieces;
        }

        let updatedPieces = prevPieces.map((piece) => {
          if (
            piece.position.x === blackPawn.position.x &&
            piece.position.y === blackPawn.position.y
          ) {
            return { ...piece, type: promotion }; // Create a new object with updated position
          }
          return piece;
        });

        sessionStorage.setItem("turn", "white");
        return updatedPieces;
      }

      return prevPieces;
    });

    setIsPromotionActive(false);
  };

  function pawnPromotion() {
    setIsPromotionActive(true);
  }

  function positionsToMove(
    fromPosition: Position,
    toPosition: Position
  ): string {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

    var move: string = `${letters[fromPosition.x]}${8 - fromPosition.y}${
      letters[toPosition.x]
    }${8 - toPosition.y} `;
    console.log(move);
    return move;
  }

  // function convertToChessPosition(position: Position): string {
  //     const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  //     const x = position.x;
  //     const y = 7 - position.y; // Invert y-coordinate to match chessboard orientation
  //     const letter = letters[x];
  //     const number = y + 1;

  //Handle drop of pieces
  const handleDrop = async (fromPosition: Position, toPosition: Position) => {
    //On piece move checks for chess rules for legality of the move.
    setPieces((prevPieces) => {
      //Verify that the move is a move not a drop back at the same spot.
      if (fromPosition.x === toPosition.x && fromPosition.y === toPosition.y) {
        return prevPieces;
      }

      //Get piece at location and check if there actually is one
      const pieceFromPosition = prevPieces.find(
        (piece) =>
          piece.position.x === fromPosition.x &&
          piece.position.y === fromPosition.y
      );

      if (!pieceFromPosition) {
        return prevPieces;
      }

      //Check if it is the turn of the piece colour moved
      if (!isTurn(pieceFromPosition)) {
        return prevPieces;
      }

      //Get castling string then see if the move performed was an attempted castle
      let castling = sessionStorage.getItem("castling");
      if (
        castling &&
        castling.length > 0 &&
        (pieceFromPosition.type === PieceType.KingBlack ||
          pieceFromPosition.type === PieceType.KingWhite)
      ) {
        const castlingResult = performCastling(
          castling,
          pieceFromPosition,
          toPosition,
          fromPosition,
          prevPieces
        );
        if (castlingResult) {
          toggleTurn();
          return castlingResult;
        }
      }

      //Check if the move attempted to be performed is a legal move.
      if (
        !isPieceMovementLegal(
          pieceFromPosition,
          fromPosition,
          toPosition,
          prevPieces
        )
      ) {
        return prevPieces;
      }

      // Create a new array with updated positions
      let updatedPieces = prevPieces.map((piece) => {
        if (
          piece.position.x === fromPosition.x &&
          piece.position.y === fromPosition.y
        ) {
          return { ...piece, position: { ...toPosition } }; // Create a new object with updated position
        }
        return piece;
      });

      //Check if there is a piece at the position that was attempted to be moved to.
      const pieceAtPosition = prevPieces.find(
        (piece) =>
          piece.position.x === toPosition.x && piece.position.y === toPosition.y
      );

      const enpassant = sessionStorage.getItem("enpassant");
      // Checks if there is a piece at the location and filter it out if captured - if not checks if the piece was an enpassant move
      if (pieceAtPosition && pieceFromPosition) {
        //Check youre not capturing a piece of the same colour
        if (
          isLowerCase(pieceAtPosition.type) !==
          isLowerCase(pieceFromPosition.type)
        ) {
          updatedPieces = updatedPieces.filter(
            (obj) => obj.position !== pieceAtPosition.position
          );
        } else {
          return prevPieces;
        }
      } else if (
        !pieceAtPosition &&
        pieceFromPosition &&
        enpassant &&
        enpassant.length > 0
      ) {
        const x: number = parseInt(enpassant[0]);
        const y: number = parseInt(enpassant[1]);
        if (
          (x === toPosition.x &&
            pieceFromPosition.type === PieceType.PawnBlack &&
            y === toPosition.y - 1) ||
          (pieceFromPosition.type === PieceType.PawnWhite &&
            y === toPosition.y + 1)
        ) {
          updatedPieces = updatedPieces.filter(
            (obj) => !(obj.position.x === x && obj.position.y === y)
          );
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
      if (
        pieceFromPosition.type == PieceType.PawnBlack ||
        PieceType.PawnWhite
      ) {
        isEnpassantableCheck(fromPosition.y, toPosition.y, toPosition.x);
      } else {
        sessionStorage.setItem("enpassant", ``);
      }

      //Made for pawn promotion
      if (
        pieceFromPosition.type === PieceType.PawnWhite &&
        toPosition.y === 0
      ) {
        //Promote White
        pawnPromotion();
      } else if (
        pieceFromPosition.type === PieceType.PawnBlack &&
        toPosition.y === 7
      ) {
        //Promote Black
        pawnPromotion();
      } else {
        //convert to a move and store in the string
        let moves = sessionStorage.getItem("moves");

        if (moves) {
          moves = `${moves}${positionsToMove(fromPosition, toPosition)}`;
          sessionStorage.setItem("moves", moves);
        }

        toggleTurn();
      }

      return updatedPieces;
    });
  };

  //Render chess tile with/without piece
  const renderTile = (
    position: Position,
    postionName: string,
    color: "white" | "black"
  ) => {
    const piece = pieces.find(
      (piece) =>
        piece.position.x === position.x && piece.position.y === position.y
    );
    return (
      <ChessTile
        position={position}
        positionName={postionName}
        color={color}
        onDrop={handleDrop}
      >
        {piece && (
          <DraggablePiece type={piece.type} position={piece.position} />
        )}
      </ChessTile>
    );
  };

  //Render chess board
  const renderBoard = () => {
    const tiles = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const position = { x, y };
        const postionName = String.fromCharCode(97 + x) + (8 - y).toString();
        const color = (y + x) % 2 !== 0 ? "black" : "white";
        tiles.push(renderTile(position, postionName, color));
      }
    }
    return tiles;
  };

  const movesPlayed = () => {
    const moves = sessionStorage.getItem("moves")
    if(moves) {
      const movesArray = moves?.split(' ');
      return (
          <>
              {movesArray?.slice(2).map((move: string, index: number) => (
                  <p key={index}>{move}</p>
              ))}
          </>
      );    
    }
  };

  const currentTurn = () => {
    const turn = sessionStorage.getItem("turn")
    if (turn){
      return (
          <>
          <h2>Current Turn: {turn!.charAt(0).toUpperCase() + turn!.slice(1)}</h2>
          </>
      )
    }
};

  return (
    <div className="game-screen">
        <div className="playingfield">
      <div className="chessboard">
        {renderBoard()}
        {isPromotionActive && (
          <PromotionSelection onSelectPiece={handlePawnPromotion} />
        )}
      </div>
      <div className="turn">
        {
            currentTurn()
        }
        </div>
        </div>
      <div className="moves">
        <h2> Moves Played </h2>
        {movesPlayed()}
      </div>
    </div>
  );
};

export default ChessBoard;
