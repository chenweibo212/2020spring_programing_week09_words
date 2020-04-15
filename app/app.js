// Your program here
const p5 = require("p5");
const fetch = require('node-fetch');


async function getWords(){
    try {
        let response = await fetch("/words")
            .then((result) => {
                return result.json();
            });
        console.log(response);
        return response;
    } catch (err) {
        console.log(err);
        return null;
    }
}

let words = [];
let width = window.innerWidth - 10;
let height = window.outerHeight - 20;

const aSentence = "I’m glad you’re on the other side of this glass screen. Using this laptop the mouse is my avatar, clicking and scrolling for utilitarian means. Most use their devices in an automated way, without reflecting on their gestures. Let’s defamiliarize our tools and use them as a vehicle for contemplation."

function cleanText(text){
    return text.replace(/\[[0-9]+\]/g, " ").replace(/\./g, "").replace(/[,]+/g, "");
}

function cleanSentence() {
    let clean = cleanText(aSentence).toLowerCase();
    let theArray = clean.split(/\s/).filter(Boolean);
    return theArray
}

getWords().then(data => {
    console.log(data); 
    words = data.concat(cleanSentence());
    console.log(words);
    const myp5 = new p5(p5draw, "main");
});

const p5draw = (p) => {
    let wordArrange;

    p.setup = () => {
        p.createCanvas(width,height);
        p.textSize(25);
        wordArrange = new Arrange(p, words, 0, 0, p.width);
    }

    p.draw = () => {
        p.background(255);
        wordArrange.draw(p);
    }

    p.mousePressed = () => {
        wordArrange.mouseIsPressed(p);
    }

    p.mouseReleased = () => {
        wordArrange.mouseIsReleased();
    }

    class Word {
        constructor(p, t, x, y){
            this.t = t;
            this.x = x;
            this.y = y;
            this.width = parseInt(p.textWidth(this.t)) + 8;
            this.height = 30;
            this.grabX = 0;
            this.grabY = 0;
            this.isDragging = false;
        }
    
        update(p){
            if(this.isDragging){
                this.x = p.constrain(this.x + p.mouseX - this.grabX, 0, p.width - this.width);
                this.grabX = p.mouseX;
                this.y = p.constrain(this.y + p.mouseY - this.grabY, 0, p.height - this.height);
                this.grabY = p.mouseY;
                console.log(this.x, this.y);
                return true;
            }
            return false;
        }
    
        display(p){
            p.rectMode(p.CORNER);
           // p.fill(this.mouseOver(p) ? (p.mouseIsPressd ? 215 : 230) : 255);
            p.fill(255);
            //p.strokeWeight(this.mouseOver(p) ? (p.mouseIsPressd ? 1 : 2) : 1);
            if(this.mouseOver(p)){
                p.fill(150);
                p.strokeWeight(0);
                p.rect(this.x + 5 , this.y + 5, this.width * 2, this.height * 2);
                p.fill(255);
                p.strokeWeight(4);
                p.rect(this.x, this.y, this.width * 2, this.height * 2);
                p.fill(0);
                p.textSize(50);
                p.text(this.t, this.x + 8, this.y + 50);
            } else {
                p.strokeWeight(1);
                p.rect(this.x, this.y, this.width, this.height);
                p.fill(0);
                p.textSize(25);
                p.text(this.t, this.x + 4, this.y + 25);
            }
        }
    
        mouseOver(p){
            return p.mouseX > this.x && p.mouseX < this.x + this.width
             && p.mouseY > this.y && p.mouseY < this.y + this.height;
        }

        mousePressed(p){
                if(this.mouseOver(p)){
                    this.grabX = p.mouseX;
                    this.grabY = p.mouseY;
                    this.isDragging = true;
                }
        }

        mouseReleased(){
                if(this.isDragging){
                    this.isDragging = false;
                }
        }

    }

    class Arrange {
        constructor(p, wordList, x, y, w) {
            this.wordList = wordList;
            this.x = x;
            this.y = y;
            this.w = w;
            this.words = [];
            for (let i = 0; i < this.wordList.length; i ++){
                this.words.push(new Word(p, this.wordList[i], this.x, this.y));
            }
           //this.placeWords(p, this.wordList, this.x, this.y, this.w);
           this.placeRandom(p, this.wordList, this.x, this.y);
        }
    
        placeWords(p, wordList, startX, startY, w){
            let x = startX + 1;
            let y = startY + 1;
            for(let i = 0; i < wordList.length; i++){
                let nextWidth = parseInt(p.textWidth(wordList[i])) + 9;
                if (x + nextWidth > startX + w - 1) {
                    y += 21;
                    x = startX + 1;
                }
                this.words[i] = new Word(p, wordList[i], x, y);
                x += nextWidth;
            }
        }

        placeRandom(p, wordList, x, y){
            for(let i = 0; i < wordList.length; i++){
                let placementX = x + parseInt(p.random(20, p.width - 80));
                let placementY = y + parseInt(p.random(20, p.height-60));
                this.words[i] = new Word(p, wordList[i], placementX, placementY);
            }
        }

        moveToFront(moveIndex){
            let wordToMove = this.words[moveIndex];
            for (let i = moveIndex; i > 0; i --){
                this.words[i] = this.words[i-1];
            }
            this.words[0] = wordToMove;
            console.log(wordToMove);
        }
    
        draw(p) {
            for (let i = 0; i < this.words.length; i++){
                if(this.words[i].update(p)){
                    this.moveToFront(i);
                    break;
                }
            }
    
            for (let i = this.words.length - 1; i >= 0; i--){
                this.words[i].display(p);
            }
        }

        mouseIsPressed(p){
                console.log("moving")
                this.words.forEach(aWord => {
                    aWord.mousePressed(p);
                })
        }
    
        mouseIsReleased(){
                console.log("released");
                this.words.forEach(aWord => {
                    aWord.mouseReleased();
                })
        }
    }
}