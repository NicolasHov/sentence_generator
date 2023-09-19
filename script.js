import { readFileSync } from 'fs';
// import { famousNames, verbs, strangePlaces } from "./data.js";

const learn_proba = sentences => {

    let P = []

    const check = (i, j) => {
        if (!P[i]) P[i] = []
        if (!P[i][j]) P[i][j] = 0
    }

    sentences.forEach(sentence => {
        console.log(sentence);
        sentence.forEach(word => {
            let first = word

            check("START", first)
            P["START"][first] += 1

            check("START", "TOTAL")
            P["START"]["TOTAL"] += 1

            for (let i = 0; i < sentence.length - 1; ++i) {
                let current = sentence[i]
                let next = sentence[i + 1]

                check(current, next)
                P[current][next] += 1

                check(current, "TOTAL")
                P[current]["TOTAL"] += 1
            }
        });
    })
    return P
}

// From https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = max => {
    return Math.floor(Math.random() * max)
}

const generate_word = (P) => {

    const pick = p => {
        let max = getRandomInt(p["TOTAL"])
        let i = 0;
        for (const [key, value] of Object.entries(p)) {
            if (key == "TOTAL") continue
            i += value
            // console.log(key)
            if (i >= max) return key
        }
    }

    let w = "START"
    let word = []
    // for (let i = 0; i < size; i++) {

    let p = P[w]
    // console.log("p", p);
    w = pick(p)
    // console.log("w: ", w);
    word.push(w)
    // }
    return word
}

try {
    // From https://nodejs.dev/learn/reading-files-with-nodejs
    const data = readFileSync('./phrasesSimples.txt', 'UTF-8');

    // Cleaning
    const splitInSentence = data.split(/\r?\n/);
    let sentences = []
    splitInSentence.forEach(sentence => {
        let punctuationless = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        sentences.push(punctuationless.split(" "))
    })
    // console.log(sentences);
    // Learning
    const P = learn_proba(sentences);
    // console.log(P);
    // Infer
    for (let i = 0; i < 100; i++) {
        console.log(generate_word(P) + " " + generate_word(P) + " " + generate_word(P) + " " + generate_word(P))
        // console.log(famousNames[getRandomInt(famousNames.length)] + " " + verbs[getRandomInt(verbs.length)] + " " + "dans le " + strangePlaces[getRandomInt(strangePlaces.length)] + " " + "et pense que " +);
    }

}
catch (err) {
    console.error(err);
}
