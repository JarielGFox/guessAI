import { fetchRandomCharacter } from "./api.js";

// 1) Inserire IIFE in script.js per evitare cluttering del global scope.
// 2) Organizzare i file con pattern MVC.

/*-------------------
 LISTA VARIABILI 
--------------------*/

// VARIABILI CLASSI
const loader = document.querySelector('.loading');
const modal = document.querySelector(".modal");
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const clearHistory = document.querySelector('#clear-history');
const clearMessage = document.querySelector('#clear-success');

// VARIABILI ELEMENTI
const submitAnswer = modalContent.nextElementSibling.nextElementSibling;
const esito = document.getElementById('esito');

// Ricordarsi di creare funzione per resettare/pulire chat per ripartire da capo
let chatHistory = [];

// Contatore tentativi rimanenti dopo risposte sbagliate
let attemptCounter = 3;

let randomCharacter;
/*----------------------------------
    INIZIO GIGA FUNZIONE ASINCRONA 
-------------------------------------*/

async function playCharacter(nameCharacter) {
    //Mostrare il loader
    loader.classList.remove("loading-hidden");

    // const action, prende un'azione dalla lista sotto;
    const action = getRandomAction();
    const prompts = getRandomPrompts();

    //il contenuto della conversazione e chat verrà pushato in chatHistory
    chatHistory.push({
        role: `system`,
        content: `${prompts} NON essere mai lo stesso personaggio E NON RIPETERTI. Restituisci SOLO il "nome" ED EVENTUALMENTE il "soprannome" del personaggio tra PARENTESI QUADRE all'inizio del tuo messaggio. Utilizzando massimo 100 parole ${action}. Le tue risposte devono seguire questo esempio:\n\n###\n\n[Nome Personaggio] ${action}###`,
    });

    //Attendiamo il return di fetchRandomCharacter che sarà il return di "message".
    randomCharacter = await fetchRandomCharacter(chatHistory);
    if (!randomCharacter) {
        alert('Qualcosa è andato storto! Controlla lo status di OpenAI.');
        return;
    }

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


    // Nascondere il loader e mostrare la modale
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
});

clearHistory.addEventListener('click', () => {
    chatHistory = [];
    clearMessage.innerHTML = 'Congratulazioni, cronologia pulita correttamente.';

    setTimeout(() => {
        clearMessage.innerHTML = '';
    }, 3000);
});

