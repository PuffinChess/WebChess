const url = 'https://localhost:5165/api/Chess'

interface TextResponse {
    text: string;
}

export async function startNewGameUCI(): Promise<boolean> {
    try{
    const responseUci = await fetch('http://localhost:5247/api/UCI/', 
    { 
        method: "POST", 
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
          body: JSON.stringify("uci")
    });

    const responseMessageUci = await responseUci.text();

    if (!responseMessageUci || responseMessageUci !== "uciok" ) 
    {
        return false;
    }

    const responseIsReady = await fetch('http://localhost:5247/api/UCI/', 
    { 
        method: "POST", 
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
          body: JSON.stringify("isready")
    });

    const responseMessageIsReady = await responseIsReady.text();

    if (responseMessageIsReady === "readyok" ) 
    {
        return true;
    }
    }
    catch {
    return false;

    }

    return false;
}

// async function startNewGameUCIFEN(message: string): Promise<string | null> {
    
//     try {
//         const response
//     }
    
    
    
//     return null;
// }


// Example working function Get
// const response = await fetch('http://localhost:5247/api/UCI/', 
//     { 
//         method: "GET", 
//         headers: {
//             'Access-Control-Allow-Origin':'*'
//           }
//     }) 