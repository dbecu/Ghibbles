class ViewBubble{
    #xPos;
    #yPos;
    #anchoredTo;

    constructor(bubble, radius, xPos = width/2, yPos = height/2){
        this.data = bubble;
        this.xPos = xPos;
        this.yPos = yPos;
        
        this.radius = radius;
        this.isActive = true;
        this.color = bubble.color;
        this.isHighlighted = false;   
        
        //xPos, yPos, damp, mass, springInput
        this.springMovement = new SpringMovement(this.xPos, this.yPos, 0.6, 22.0, 0.1);
        // this.springMovement = new SpringMovement(this.xPos, this.yPos, 0.95, 9.0, 0.1);

        this.moving = false;

        // Child functionality
        this.anchoredTo = [];
        this.initialAnglePos = 0;

        //image
        this.resetImage();
    }

    static constructBubble(bubble){
        this.bubble = bubble;
        return this;
    }

    getImageFromPath(){
        let img = (BubbleController.getInstance().getImages()[this.data.imageUrl].image);
        if (img != null){
            return img;
        }
    
    }

    resetImage(){
        let tinkerImage = this.getImageFromPath();
        console.log(tinkerImage);

        if (tinkerImage == null) {
            return;
        }

        imageMode(CORNER);
        // length = this.radius;
        length = 100;
        let newHeight = tinkerImage.height;
        let newWidth = tinkerImage.width;
    
        //if height is smaller
        if (tinkerImage.height < tinkerImage.width){
            newHeight = length;
            newWidth = (tinkerImage.width / tinkerImage.height) * length;
        } else {
            newWidth = length;
            newHeight = (tinkerImage.height / tinkerImage.width) * length;
        }
        tinkerImage.resize(newWidth, newHeight);
    
        let widthStartPoint = (newWidth / 2) - (length / 2);
        let heightStartPoint = (newHeight / 2) - (length / 2);
    
        let newImage = createImage(length, length);
        newImage.loadPixels();
        for (let x = 0; x < newImage.width; x++) {
            for (let y = 0; y < newImage.height; y++) {    
                newImage.set(x, y, tinkerImage.get(widthStartPoint + x, heightStartPoint + y));
            }
        }
        newImage.updatePixels();
    
        maskShape = createGraphics(length, length);
        maskShape.circle(length/2, length/2, length);
    
        newImage.mask(this.maskShape);
        tint(this.color);

        this.image = newImage;  
    }

    addToAnchorList(vBubble){
        this.anchoredTo.push(vBubble);

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
        let buffer = 10;

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
            // fill(color(50, 100, 100, 0.6));
            fill(this.color);
        }else {
            fill(color(10, 10, 10, 0.1));
        }

        if (this.image != null){
            image(this.image, this.xPos, this.yPos);
        }
        circle(this.xPos, this.yPos, this.radius);
    
        if (this.isActive){
            fill(color(0));
        }else {
            fill(color(0, 0.4));
        }
        noStroke();

        textSize(12);
        fill(255);
        textAlign(CENTER, CENTER);  
        text(this.data.name, this.xPos, this.yPos);    
    }

    #displayRelation(){
        if (this.isHighlighted){
            stroke(color(100, 90, 90, 1)); //HSB
            strokeWeight(4);
        } else {
            stroke(color(200, 60, 50, 0.4));
            strokeWeight(2);
        }

        for(let a of this.anchoredTo){
            line(this.xPos, this.yPos, a.xPos, a.yPos);
        }
    }

    #displayAnchorChanges(vBubble){
        
    }

}