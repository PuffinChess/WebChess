import axios from "axios";

const url = 'https://localhost:5165/api/Chess'

interface TextResponse {
    text: string;
}

export async function startNewGame(): Promise<string | null> {
    // const text = "uci"
    // try {
    //     const response = await axios.post<TextResponse>(
    //         'https://localhost:5165/api/Chess/text', // Replace with your actual API URL
    //         { text }
    //     );
    //     console.log( response.data.text);
    //     return response.data.text
    // } catch (error) {
    //     console.error(error);
    //     return null
    // }
    const response = await fetch('http://localhost:5247/api/UCI/', 
    { 
        method: "GET", 
        headers: {
            'Access-Control-Allow-Origin':'*'
          }
    }) 

    console.log(await response.text());


    const response2 = await fetch('http://localhost:5247/api/UCI/', 
    { 
        method: "POST", 
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
          body: JSON.stringify("uci")
    }) 

    console.log(await response2.text());

    return null;
}

// async function startNewGameaFEN(message: string): Promise<string | null> {
    
//     try {
//         const response
//     }
    
    
    
//     return null;
// }