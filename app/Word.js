const p5 = require("p5");


module.exports = class Word {
    constructor(p, t, x, y){
        this.t = t;
        this.x = x;
        this.y = y;
        this.width = parseInt(p.textWidth(this.t)) + 8;
        this.height = 20;
        this.grabX = 0;
        this.grabY = 0;
        this.isDragging = false;
    }

    update(p){
        if(this.isDragging){
            this.x = p.constrain(this.x + p.mouseX - grabX, 0, p.width - this.width);
            this.grabX = p.mouseX;
            this.y = p.constrain(this.y + p.mouseY - grabY, 0, p.height - this.h);
            grabY = p.mouseY;
            return true;
        }
        return false;
    }

    display(p){
        p.rectMode(p.CORNER);
        p.fill(this.mouseOver() ? (p.mousePressd ? 215 : 230) : 255);
        p.rect(this.x, this.y, this.width, this.height);
        p.strokeWeight(1);
        p.fill(0);
        p.text(this.t, this.x + 4, this.y + 14);
    }

    mouseOver(p){
        return p.mouseX > this.x && p.mouseX < this.x + this.width
         && this.mouseY > this.y && this.mouseY < this.y + this.height;
    }

    mousePressd(p){
        if(this.mouseOver()){
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