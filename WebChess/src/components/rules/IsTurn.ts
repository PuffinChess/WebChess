import { Piece } from "../pieces/Piece";
import { isLowerCase } from "../utils/IsLowerCase";

export function isTurn(pieceFromPosition: Piece): Boolean {
    let turn = sessionStorage.getItem("turn")
    let botColour = sessionStorage.getItem("botColour")

    if (!isLowerCase(pieceFromPosition.type) && turn === "white") {
        return true;
    }
    else if (isLowerCase(pieceFromPosition.type) && turn === "black"){
        return true;
    }
    return false;
}

// && botColour !== "white"
//&& botColour !== "black"