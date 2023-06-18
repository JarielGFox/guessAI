import { APIKEY as API_KEY } from "./source.js";

//VARIABILI API
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";

// parametri AI
const temperature = 1.0;
const frequency_penalty = 2.0;

//Recuperare la risposta con funzione asincrona
export const fetchRandomCharacter = async (
    chatHistory
) => {
    try {
        //Chiamare le Api di Open AI
        const response = await fetch(API_URL, {
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
        })
        // attendiamo la risposta da open AI
        const data = await response.json();
        // otteniamo il contenuto di "message"
        // https://platform.openai.com/docs/api-reference/making-requests
        const message = data.choices[0].message.content;

        // returns random character as an array
        // A volte può mettere le virgole e questo causa apparizione di modale vuota, pensare ad un fix.
        return message.split(/\[|\]/);


    } catch (error) {
        console.log('Controlla il credito dell\'API o il suo server status.', error);

        return;
    }

}