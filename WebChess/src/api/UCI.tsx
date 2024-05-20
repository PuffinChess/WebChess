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
    fetch('https://localhost:7053/api/UCI', { method: "GET" }) // Construct url
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
        })
        .then((data) => {
            console.log(data);
            return data
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });

    return null
}

// async function startNewGameaFEN(message: string): Promise<string | null> {
    
//     try {
//         const response
//     }
    
    
    
//     return null;
// }