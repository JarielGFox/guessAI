import { APIKEY } from "./source.js";

/*-----------
    VARIABILI 
------------*/

const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";

// Inserisci qui la tua chiave API
const API_KEY = APIKEY;

const loader = document.querySelector('.loading');
const modal = document.querySelector(".modal");
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

const submitAnswer = modalContent.nextElementSibling.nextElementSibling;
const esito = document.getElementById('esito');
// let randomCharacter = '';

// Contatore tentativi
let attemptCounter = 3;

/*-----------
    FUNCTIONS 
------------*/
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
    // 3. Recuperare la risposta
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                {
                    role: "user",
                    content: ` ${prompts} NON essere mai lo stesso personaggio. Restituisci SOLO il "nome" ED EVENTUALMENTE il "soprannome" del personaggio tra PARENTESI QUADRE all'inizio del tuo messaggio. Utilizzando massimo 100 parole ${action}. \n`,
                }
            ],
            frequency_penalty: frequency_penalty,
            temperature: temperature
        })
    })

    // 4. Interpretare la risposta in JSON
    const data = await response.json();
    // 5. Compilare la modale con i dati ricevuti
    const message = data.choices[0].message.content;
    let randomCharacter = message.split(/\[|\]/);

    // Contatore risposta:

    let answerCounter = 0;

    // Al momento in console stampa la risposta giusta per motivi di test
    console.log(randomCharacter[1]);

    modalContent.innerHTML = `
        <h2>${nameCharacter}</h2>
        <p>${randomCharacter[2]}</p>
        <code>action: <b>${action}</b></code>
    `;

    submitAnswer.addEventListener('click', (event) => {
        attemptCounter--;
        event.stopImmediatePropagation();

        let risposta = modalContent.nextElementSibling.value;

        for (let i = 0; i < risposta.length; i++) {
            for (let j = 0; j < randomCharacter[1].length; j++) {
                if (risposta[i].toLowerCase() === randomCharacter[1][j].toLowerCase()) {
                    answerCounter++;
                    break;
                }
            }
        }
        // eventualmente fare una soluzione meno arronzata:
        let winCondition = randomCharacter[1].length / 2 - 0.5;

        if (attemptCounter > 0) {
            if (answerCounter >= winCondition) {
                esito.classList.remove('loading-hidden');
                esito.innerHTML = `Congratulazioni! Risposta esatta!
                    <br />
                    <br />
                    Per continuare a giocare, premi sulla X e continua!`;
                attemptCounter = 3;
            } else {
                esito.classList.remove('loading-hidden');
                esito.innerHTML = `Mi dispiace, hai sbagliato, hai ancora ${attemptCounter} tentativi</b>
                <br/>
                <br />
                Per continuare a giocare, premi sulla X e riprova!
                `;
            }
        } else {
            submitAnswer.setAttribute('disabled', '');
            esito.innerHTML = `Mi dispiace la risposta corretta era ${randomCharacter[1]}, hai esaurito i tentativi a disposizione. Premi sulla X per continuare a giocare.`;
        }


        // console.log(answerCounter);
        // console.log(winCondition);

        answerCounter = 0;
    })

    // 6. Nascondere il loader e mostrare la modale
    loader.classList.add("loading-hidden");
    modal.classList.remove("modal-hidden");
}

function getRandomPrompts() {
    const prompts = [
        "Sei un personaggio dei fumetti. Selezionalo tra quelli che conosci, NON rivelare il tuo NOME o il tuo SOPRANNOME o il tuo alter-ego e dettagli sulla tua identità.",
        "Sei un personaggio famoso della realtà tra quelli che conosci, NON rivelare il tuo NOME e dettagli sulla tua identità.",
        "Sei un personaggio dei videogiochi tra quelli che conosci. NON rivelare il tuo nome, nè dettagli sulla tua identità.",
        "Sei un personaggio di un film o una serie tv tra quelli esistenti. NON rivelare il tuo nome, nè dettagli sulla tua identità.",
        "Sei un personaggio di un libro o di un'opera tra quelli esistenti. NON rivelare il tuo nome, nè dettagli sulla tua identità.",
        "Sei una celebrità esistente tra quelli che conosci ed esistenti. NON rivelare il tuo nome, nè dettagli sulla tua identità.",
        "Sei un filosofo o un personaggio storico tra quelli che conosci e che sono esistiti. NON rivelare il tuo nome, nè dettagli sulla tua identità.",
        "Sei un'artista esistente e famoso. NON rivelare il tuo nome, nè dettagli sulla tua identità."
    ];

    const RandomPrompts = Math.floor(Math.random() * prompts.length); // da 0 a X

    return prompts[RandomPrompts];
}

function getRandomAction() {
    const actions = [
        'saluta nel TUO modo più iconico',
        'racconta la TUA ultima avventura',
        'rispondi con una TUA famosa citazione',
        'parlaci di chi è il TUO migliore amico O braccio destro O la TUA NEMESI',
        'ipotizza di scrivere la TUA biografia di linkedin omettendo il TUO nome E ruolo'
    ];

    const indexRandom = Math.floor(Math.random() * actions.length); // da 0 a 5

    return actions[indexRandom];
}

/*-----------
    INIT & EVENTS
------------*/
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
    location.reload();
});
