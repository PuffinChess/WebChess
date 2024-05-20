
const url = 'https://localhost:5165/api/Chess'

export async function startNewGame(): Promise<string | null> {
    
    try {
        const response = await fetch(`${url}?message=uci`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });
        
        if (!response.ok) { console.log(response)}
        else {
            console.log(await response.text());
        }
    }
    catch (error) {
        throw new Error(`Something went wrong: ${error.message}`);
    }
    return null;
}

// async function startNewGameaFEN(message: string): Promise<string | null> {
    
//     try {
//         const response
//     }
    
    
    
//     return null;
// }