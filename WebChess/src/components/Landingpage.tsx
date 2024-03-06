import React from "react"
import "../App.scss"
import { Link } from "react-router-dom";

function ChessBoard() {

    return (
        //For getting FEN (Forsyth–Edwards Notation) string for stating position
        <div className='landingpage'>
            <Link to={"/chessboard"}><button>Standard Layout</button></Link>
        </div>
    )
}

export default ChessBoard