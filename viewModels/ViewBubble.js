class ViewBubble{
    #xPos;
    #yPos;

    constructor(bubble, xPos = width/2, yPos = height/2){
        this.data = bubble;
        this.xPos = xPos;
        this.yPos = yPos;
        
        this.radius = 100;
        this.isActive = true;
        this.color = color("#99aaff");
        this.isHighlighted = false;

        //xPos, yPos, damp, mass, springInput
        this.springMovement = new SpringMovement(this.xPos, this.yPos, 0.6, 20.0, 0.1);
        this.moving = false;
        // this.springMovement = new SpringMovement(this.xPos, this.yPos, 0.95, 9.0, 0.1);

        // Child functionality
        this.anchoredTo = [];
        this.initialAnglePos = 0;
    }

    static constructBubble(bubble){
        this.bubble = bubble;
        return this;
    }

    setNewPosition(x, y){
        if (!this.moving){
            this.moving = true;

            x = constrain(x, this.radius, width - this.radius);
            y = constrain(y, this.radius, height - this.radius);

            this.springMovement.changeAnchorPos(x, y);
            this.xPos = x;
            this.yPos = y;
        }
    }

    getPosition(){
        return createVector(this.xPos, this.yPos);
    }

    update(){
        let buffer = 20;

        if (this.anchoredTo.length >= 1){
            let vBubble = this.anchoredTo[0];
            let v = p5.Vector.sub(createVector(vBubble.xPos, vBubble.yPos), createVector(this.xPos, this.yPos));

            if (v.mag() > vBubble.radius + this.radius + buffer) {
                v.normalize();
                let maxDistance = vBubble.radius + this.radius;
                if (!vBubble.isActive) { maxDistance += buffer; }

                let newX = vBubble.xPos - random(v.x * maxDistance);
                let newY = vBubble.yPos - random(v.y * maxDistance);
    
                if (this.anchoredTo.length > 1){
                    let centralPos = this.#middlePosOfAllAnchors();
                    this.setNewPosition(centralPos.x, centralPos.y);

                }
                else {
                    this.setNewPosition(newX, newY);
                }
            }
        }

        let springPos = this.springMovement.updatePosition();
        this.xPos = springPos.x;
        this.yPos = springPos.y;

        // How close factor
        if (abs(this.springMovement.xPos - this.xPos) < buffer 
            && abs(this.springMovement.yPos - this.yPos) < buffer){
            this.moving = false;
        }
        
    } 

    #middlePosOfAllAnchors(){
        let sumX = 0;
        let sumY = 0;
      
        for(let a of this.anchoredTo){
            sumX += a.xPos;
            sumY  += a.yPos;
        }

        return createVector(sumX/this.anchoredTo.length, sumY/this.anchoredTo.length);
    }

    display(){
        this.#displayRelation();
        this.#displayBubble();
    }

    #displayBubble(){
        //The bubble
        noFill();
        
        if (this.isHighlighted) {
            strokeWeight(4);
            stroke(color(90, 100, 100, 1));
        } else {
            strokeWeight(1);
            stroke(color(0, 1));
        }


        if (this.isActive){
            fill(color(50, 100, 100, 0.3));
        }else {
            fill(color(10, 10, 10, 0.1));
        }
        circle(this.xPos, this.yPos, this.radius);
        strokeWeight(2);
    
        noStroke();
        fill(color(0, 0, 0));
        textAlign(CENTER);
        text(this.data.name, this.xPos, this.yPos);    
    }

    #displayRelation(){
        stroke(color(100, 60, 50));
        strokeWeight(2);

        for(let a of this.anchoredTo){
            line(this.xPos, this.yPos, a.xPos, a.yPos);
        }
    }

}