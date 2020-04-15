const Word = require("./Word.js");

module.exports = class Arrange {
    constructor(p, wordList, x, y, w) {
        this.wordList = wordList;
        this.x = x;
        this.y = y;
        this.w = w;
        this.words = [];
        for (var i = 0; i < this.wordList.length; i ++){
            this.words.push(new Word(p, wordList[i], x, y));
        }
        this.placeWords(p, this.wordList, this.x, this.y, this.w);
    }

    placeWords(p, wordList, startX, startY, w){
        var x = startX + 1;
        var y = startY + 1;
        for(var i = 0; i < wordList.length; i++){
            var nextWidth = toInt(p.textWidth(wordList[i])) + 9;
            if (x + nextWidth > startX + w - 1) {
                y += 21;
                x = startX + 1;
            }
            this.words[i] = new Word(p, wordList[i], x, y);
            x += nextWidth;
        }
    }

    draw() {
        for (var i = 0; i < this.words.length; i++){
            if(this.words[i].update()){
                moveToFront(i);
                break;
            }
        }

        for (var i = this.words.length - 1; i >= 0; i--){
            this.words[i].display();
        }
    }

    moveToFront(moveIndex){
        var wordToMove = this.words[moveIndex];
        for (var i = moveIndex; i > 0; i --){
            this.words[i] = words[i-1];
        }
        this.words[0] = wordToMove;
    }

    mousePressed(){
        this.words.forEach(aWord => {
            aWord.mousePressed();
        })
    }

    mouseReleased(){
        this.words.forEach(aWard => {
            aWord.mouseReleased();
        })
    }
}