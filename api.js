import { APIKEY as API_KEY } from "./source.js";

//VARIABILI API
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";

// parametri AI
const temperature = 1.0;
const frequency_penalty = 2.0;

// 3. Recuperare la risposta con funzione asincrona
export const fetchResponse = async (
    chatHistory
) => {
    try {
        const response = (await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: chatHistory,
                frequency_penalty: frequency_penalty,
                temperature: temperature
            })
        })).json();

        return response;
    } catch (error) {
        console.log('Controlla il credito dell\'API o il suo server status.', error);

        return;
    }

}