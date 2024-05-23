import "../App.scss"
import { Link } from "react-router-dom";

function ChessBoard() {

    return (
        //For getting FEN (Forsyth–Edwards Notation) string for stating position
        <div className='landingpage'>
            <Link to={"/chessboard/local"}><button>Local Game </button></Link>
            <Link to={"/chessboard/bot/black"}><button>White vs Bot </button></Link>
            <Link to={"/chessboard/bot/white"}><button>Black vs Bot</button></Link>
        </div>
    )
}

export default ChessBoard