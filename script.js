import { APIKEY } from "./source.js";

/*-------------------
 LISTA VARIABILI 
--------------------*/
//VARIABILI API
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";
const API_KEY = APIKEY;

// VARIABILI CLASSI
const loader = document.querySelector('.loading');
const modal = document.querySelector(".modal");
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

// VARIABILI ELEMENTI
const submitAnswer = modalContent.nextElementSibling.nextElementSibling;
const esito = document.getElementById('esito');

// Ricordarsi di creare funzione per resettare/pulire chat per ripartire da capo
const chatHistory = [];

// Contatore tentativi rimanenti dopo risposte sbagliate
let attemptCounter = 3;

let randomCharacter;
let answerCounter;

/*----------------------------------
    INIZIO GIGA FUNZIONE ASINCRONA 
-------------------------------------*/

async function playCharacter(nameCharacter) {
    // 1. Mostrare il loader
    loader.classList.remove("loading-hidden");
    // 2. Chiamare le Api di Open AI

    // const action, prende un'azione dalla lista sotto;
    const action = getRandomAction();
    const prompts = getRandomPrompts();
    // parametri AI
    const temperature = 1.0;
    const frequency_penalty = 2.0;

    // 3. Recuperare la risposta con funzione asincrona
    const fetchResponse = async () => {
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
        });

        return response;
    }

    //il contenuto della conversazione e chat verrà pushato in chatHistory
    chatHistory.push({
        role: `system`,
        content: `${prompts} NON essere mai lo stesso personaggio E NON RIPETERTI. Restituisci SOLO il "nome" ED EVENTUALMENTE il "soprannome" del personaggio tra PARENTESI QUADRE all'inizio del tuo messaggio. Utilizzando massimo 100 parole ${action}. Le tue risposte devono seguire questo esempio:\n\n###\n\n[Nome Personaggio] ${action}###`,
    });

    // 4. Interpretare la risposta in JSON
    const response = await fetchResponse();
    const data = await response.json();
    // 5. Compilare la modale con i dati ricevuti
    const message = data.choices[0].message.content;
    randomCharacter = message.split(/\[|\]/);
    // A volte può mettere le virgole e questo causa apparizione di modale vuota, pensare ad un fix.

    // Contatore risposta:
    answerCounter = 0;

    // Al momento in console stampa la risposta giusta per motivi di test

    // Array intero 
    console.log(randomCharacter);
    // Cattura solo il nome del personaggio
    console.log(randomCharacter[1]);

    modalContent.innerHTML = `
        <h2>${nameCharacter}</h2>
        <p>${randomCharacter[2]}</p>
        <code><b>prompt:</b> ${prompts} <br /> <b>action:</b> ${action}</code>
    `;


    // 6. Nascondere il loader e mostrare la modale
    loader.classList.add("loading-hidden");
    modal.classList.remove("modal-hidden");
}

submitAnswer.addEventListener('click', (event) => {
    attemptCounter--;
    event.stopImmediatePropagation();

    let risposta = modalContent.nextElementSibling.value;

    // Controlla la percentuale di match nella risposta, passiamo alla funzione le due variabili
    let matchPercentage = compareStrings(risposta, randomCharacter[1]);

    if (matchPercentage >= 0.60) {
        // Risposta esatta
        esito.classList.remove('loading-hidden');
        esito.innerHTML = `Congratulazioni! Risposta esatta!
            <br />
            <br />
            Per continuare a giocare, premi sulla X e continua!`;
        attemptCounter = 3;
    } else if (attemptCounter > 0) {
        // Risposta sbagliata con tentativi rimanenti
        esito.classList.remove('loading-hidden');
        esito.innerHTML = `Mi dispiace, hai sbagliato, hai ancora ${attemptCounter} tentativi</b>
        <br/>
        <br />
        Per continuare a giocare, premi sulla X e riprova!
        `;
    } else {
        // Risposta sbagliata senza tentativi rimanenti
        submitAnswer.setAttribute('disabled', '');
        esito.innerHTML = `Mi dispiace la risposta corretta era ${randomCharacter[1]}, hai esaurito i tentativi a disposizione. Premi sulla X per continuare a giocare.`;
    }

    // console.log(answerCounter); // da decommentare in caso di problemi con answerCounter

    answerCounter = 0;
})

/*------------------
    INIT & EVENTS
------------------ */

const characters = document.querySelectorAll(".character");

characters.forEach(function (element) {
    element.addEventListener("click", function () {
        playCharacter(element.dataset.character);
    })
})

modalClose.addEventListener("click", function () {
    modal.classList.add("modal-hidden");
    submitAnswer.removeAttribute('disabled');
    esito.innerHTML = '';
    attemptCounter = 3;
    modalContent.nextElementSibling.value = '';
    // location.reload(); // risolvere bug che richiede aggiornamento pagina forzato, uso di closure maybe?
});
