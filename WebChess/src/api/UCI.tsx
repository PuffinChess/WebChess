const url = "https://localhost:5165/api/Chess";

interface TextResponse {
  text: string;
}

export async function startNewGameUCI(): Promise<boolean> {
  try {
    const responseUci = await fetch("http://localhost:5247/api/UCI/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("uci"),
    });

    const responseMessageUci = await responseUci.text();

    if (!responseMessageUci || responseMessageUci !== "uciok") {
      return false;
    }

    const responseIsReady = await fetch("http://localhost:5247/api/UCI/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("isready"),
    });

    const responseMessageIsReady = await responseIsReady.text();

    if (responseMessageIsReady === "readyok") {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function getBestMove(moves: string): Promise<string | null> {

  try {
    const bestMoveResponse = await fetch("http://localhost:5247/api/UCI/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(moves),
    });

    var bestMove = await bestMoveResponse.text();
    console.log(bestMove)
    return bestMove;

  } catch (error) {
    console.log(error);
    return null;
  }
}
