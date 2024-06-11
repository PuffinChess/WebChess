import "../App.scss"
import { Link } from "react-router-dom";

function ChessBoard() {

    return (
        <div className='landingpage'>
            <h1>♘ React Chess ♘</h1>
            <Link to={"/chessboard/local"}><button>Local Game </button></Link>
            <Link to={"/chessboard/bot/black"}><button>White vs Bot </button></Link>
            <Link to={"/chessboard/bot/white"}><button>Black vs Bot</button></Link>
            <Link to={"/chessboard/multiplayer"}><button>Onine vs Random Oponent</button></Link>
            <Link to={"/chat"}><button>TestCghat</button></Link>
            <h4>*Pick a game type</h4>
        </div>
    )
}

export default ChessBoard