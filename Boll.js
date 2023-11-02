let bolls = [];
let numBolls = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numBolls; i++) {
      let size = random(50, 100);
      bolls[i] = new Boll(
        size,
        random(size, windowWidth - size),
        random(size, windowHeight - size));
  }
}

function draw(){
    for (let boll of bolls){
        boll.update(bolls);
    }
    
    background(0);
    fill(255, 50);
    
    for (let boll of bolls){
        boll.draw();
    }
}

/*
class Boll{    
    static defaultConst(){
        return this.radiusConst(50);
    }
    
    static radiusConst(radius){
        return new Boll(radius, 100, 100);
    }

    constructor(radius, x, y) {
        console.log("HELLO!");
        
        this.outline = random(100, 255), random(100, 255), random(100, 255);
        
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.speed = 1.2;
        this.dx = random(-this.speed, this.speed);
        this.dy = random(-this.speed, this.speed);
    }

    update(bollArray){
        //Updates variable of positions
        this.x += this.dx;
        this.y += this.dy;
        
        //Out of bounds check
        if (this.x < this.radius) { this.dx = -this.dx; }
        if (this.x > windowWidth - this.radius) { this.dx = -this.dx; }
        if (this.y < this.radius) { this.dy = -this.dy; }
        if (this.y > windowHeight - this.radius) { this.dy = -this.dy; }
        
        //Checking interaction with all other balls
        let multiplier = 3;
        for(let i = 0; i < bollArray.length; i++){
            if (bollArray[i] != this) {
                let distance = dist(this.x, this.y, bollArray[i].x, bollArray[i].y);
                if (distance <= this.radius + bollArray[i].radius){
                    this.bounceBollAway(bollArray[i], distance);
                }
            }
        }
    }
    
    bounceBollAway(otherBoll, distance){
        let multiplier = 1.2;
        
        //This ball
        this.dx = multiplier * (this.x - otherBoll.x) / distance;
        this.dy = multiplier * (this.y - otherBoll.y) / distance;
        
        //Other ball
        otherBoll.dx = multiplier/2 * (otherBoll.x - this.x) / distance;
        otherBoll.dy = multiplier/2 * (otherBoll.y - this.y) / distance;


    }

    draw(){
        stroke(this.outline);
        circle(this.x, this.y, this.radius * 2);
    }
             

}

*/