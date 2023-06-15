/*---------------
   ALTRE FUNZIONI
---------------- */

// const chatStorage = () => {
//     chatHistory.push([

//     ])
// }

// funzione di comparazione per comparare la risposta
function compareStrings(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    let matches = 0;
    // compara ogni carattere della stringa più corta con quella più lunga
    let shorter = str1.length < str2.length ? str1 : str2;
    let longer = str1.length < str2.length ? str2 : str1;

    for (let i = 0; i < shorter.length; i++) {
        if (longer.includes(shorter[i])) {
            matches++;
        }
    }

    // calcola la percentuale di comparazione
    let matchPercentage = matches / longer.length;

    return matchPercentage;
}

// funzione che contiene l'array dei prompt di inizio per GPT
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


// funzione che contiene l'array delle azioni da poter fare
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