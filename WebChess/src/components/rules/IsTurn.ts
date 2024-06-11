import { Piece } from "../pieces/Piece";
import { isLowerCase } from "../utils/IsLowerCase";

export function isTurn(pieceFromPosition: Piece, botMove :boolean): Boolean {
    let turn = sessionStorage.getItem("turn")
    let botColour = sessionStorage.getItem("botColour")
    let multiplayerColour = sessionStorage.getItem("multiColour")


    if ( botColour) {
        if (botMove === true){
            if (!isLowerCase(pieceFromPosition.type) && turn === "white" && botColour === "white") {
                return true;
            }
            else if (isLowerCase(pieceFromPosition.type) && turn === "black" && botColour === "black"){
                return true;
            }
        }
        else{
            if (!isLowerCase(pieceFromPosition.type) && turn === "white" && botColour === "black") {
                return true;
            }
            else if (isLowerCase(pieceFromPosition.type) && turn === "black" && botColour === "white"){
                return true;
            }  
        }
        
    } else if (multiplayerColour) {
        if (botMove === true) {
            if (!isLowerCase(pieceFromPosition.type) && turn === "white" && multiplayerColour === "black") {
                return true;
            }
            else if (isLowerCase(pieceFromPosition.type) && turn === "black" && multiplayerColour === "white"){
                return true;
            }
        } else {
            if (!isLowerCase(pieceFromPosition.type) && turn === "white" && multiplayerColour === "white") {
                return true;
            }
            else if (isLowerCase(pieceFromPosition.type) && turn === "black" && multiplayerColour === "black"){
                return true;
            }  
        }
    }else if (!botColour) {
        if (!isLowerCase(pieceFromPosition.type) && turn === "white") {
            return true;
        }
        else if (isLowerCase(pieceFromPosition.type) && turn === "black"){
            return true;
        }
    }
    return false;
}

// && botColour !== "white"
//&& botColour !== "black"