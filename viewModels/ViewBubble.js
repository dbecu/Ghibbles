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

        //xPos, yPos, damp, mass, springInput
        this.springMovement = new SpringMovement(this.xPos, this.yPos, 0.8, 18.0, 0.1);
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
        this.springMovement.changeAnchorPos(x, y);
        this.xPos = x;
        this.yPos = y;
    }

    getPosition(){
        return createVector(this.xPos, this.yPos);
    }

    update(){
        if (this.anchoredTo.length > 0){
            let vBubble = this.anchoredTo[0];

            let offsetX = cos(this.initialAnglePos) * (vBubble.radius + vBubble.radius/2); // X-coordinate offset from the main circle
            let offsetY = sin(this.initialAnglePos) * (vBubble.radius + vBubble.radius/2); // Y-coordinate offset from the main circle
            let circleX = vBubble.xPos + offsetX; // X-coordinate of the smaller circle
            let circleY = vBubble.yPos + offsetY; // Y-coordinate of the smaller circle

            this.setNewPosition(circleX, circleY);
        }

        let newPos = this.springMovement.updatePosition();
        this.xPos = newPos.x;
        this.yPos = newPos.y;
        
    }

    display(){
        noFill();
        stroke(color(255, 0, 0, 100));
        fill(color(0, 0.1));
        circle(this.xPos, this.yPos, this.radius);
        strokeWeight(2);
        // point(bubble.xPos, bubble.yPos);
    
        noStroke();
        fill(color(0, 0, 0));
        textAlign(CENTER);
        text(this.data.name, this.xPos, this.yPos);    
    }


}