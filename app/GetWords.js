const osmosis = require("osmosis");
const sbd = require("sbd");
const pos = require("pos");
const syllable = require("syllable");
const lexer = new pos.Lexer();
const tagger = new pos.Tagger();

async function getText(){
    return new Promise((resolve, reject) => {
        let text = [];
        osmosis.get("https://www.e-flux.com/journal/45/60100/international-disco-latin/")
               .find("p")
               .set("paragraph")
               .data((item) => text.push(item.paragraph))
               .done(() => resolve(text))
               .error(e => reject(e));
    })
}

function scramble(array){
    for(let i = 0; i < array.length; i++){
        const randomIndex = Math.floor(Math.random() * array.length);
        const tmp = array[randomIndex];
        array[randomIndex] = array[i];
        array[i] = tmp;
    }
}

function cleanText(text){
    return text.replace(/\[[0-9]+\]/g, " ").replace(/\./g, "").replace(/[,]+/g, "");
}

async function posPoem(){
    const paragraphs = await getText();
    const posTypesVB = ["VB"];
    const tokensVB = [];

    paragraphs.forEach(pg => {
        const cleanpg = cleanText(pg);
        const sentences = sbd.sentences(cleanpg);
        sentences.forEach(sentence => {
            const lexes = lexer.lex(sentence);
            const tages = tagger.tag(lexes);
            tages.forEach(tag => {
                //is the POS one of the ones we want
                if (posTypesVB.includes(tag[1])){
                    //ignore duplicates
                    if (!tokensVB.includes(tag[0])){
                        tokensVB.push(tag[0].toLowerCase());
                    }
                }
                scramble(tokensVB);
            });
        });
    });

    return tokensVB.slice(0, 10);
}

function mode(arr){
    return arr.sort((a,b) => arr.filter(v => v===a).length - arr.filter(v => v===b).length).pop();
}

async function GetWords() {
    return posPoem();
}

GetWords().then(res => console.log(res));

// if (require.main === module) {
//     GetWords().then(res => console.log(res));
// }

module.exports = {
    GetWords
};