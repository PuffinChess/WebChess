import "../App.scss"
import { useParams } from "react-router-dom"
import { returnImageUrl } from "./utils/ReturnImageUrl";

class Tile {
    constructor(public id: string, public backgroundColor: string, public piece?: string) { }
}

function createTiles(rows: number, cols: number): Tile[] {
    let tiles: Tile[] = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const backgroundColor = (y + x) % 2 !== 0 ? "black" : "white";
            // Generate tile ID in the format of "a8" to "h1"
            const tileId = String.fromCharCode(97 + x) + (8 - y).toString();
            tiles.push(new Tile(tileId, backgroundColor));
        }
    }
    return tiles;
}

function assignPiecesFEN(fen: string, tiles: Tile[]) {
    const fenBoardSplit = fen.split(' ')[0];
    const fenBoard = fenBoardSplit.replace(/\//g, "");

    console.log(fenBoard);
    let emptyCounter = 0;
    for (let i = 0; i < fenBoard.length; i++) {
        if (!isNaN(Number(fenBoard[i]))) {
            emptyCounter = emptyCounter + (Number(fenBoard[i]) - 1);
        }
        else {
            tiles[i + emptyCounter].piece = fenBoard[i];
        }
    }
    return tiles;
}

//Html bassed movement
// let activePiece: HTMLElement | null = null;

// function grabPiece(e: React.MouseEvent){
//     const element = e.target as HTMLElement;
//     activePiece = element;
// }

// function movePiece(e: React.MouseEvent){
//     if (activePiece) {
//         activePiece.style.position = "absolute";
//         activePiece.style.left = `calc(${e.clientX}px - 4vh)`;
//         activePiece.style.top = `calc(${e.clientY}px - 4vh)`;
//     }
// }

// function dropPiece(e: React.MouseEvent) {
//     if (activePiece){
//         activePiece = null;
//     }
// }

// onMouseMove={e => movePiece(e)} onMouseDown={e => grabPiece(e)} onMouseUp={e => dropPiece(e)}

function ChessBoard() {
    let tiles: Tile[] = [];

    tiles = createTiles(8, 8);
    tiles = assignPiecesFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", tiles);

    return (
        <div className='chessboard'>
            {tiles.map((tile, index) => (
                <div key={index} id={tile.backgroundColor}>
                    {tile.piece && <img draggable="false" src={returnImageUrl(tile.piece)} />}
                </div>
            ))}
        </div>
    )
}

export default ChessBoard