class ViewBubble{
    constructor(bubble, mass, radius, x = null, y = null){
        this.data = bubble;        
        this.color = bubble.color;

        this.isActive = true;
        this.isHighlighted = false;   
        this.isChildHighlighted = false;

        this.anchoredTo = [];

        //test
        this.c2World = new c2.World(new c2.Rect(0, 0, width, height));
        this.c2World.addInteractionForce(new c2.Gravitation(0.9));

        if (x == null)  x = random(radius, width - radius);
        if (y == null) y = random(radius, width - radius);
        let p = new c2.Particle(x, y);
        p.mass = mass;
        p.radius = radius;
        this.c2World.addParticle(p);      
    }

    update(){
        this.c2World.update();
        
        if (this.anchoredTo.length == 1) {
            let p = this.anchoredTo[0].c2World.particles[0].position;
            this.newPoint(p.x, p.y);
        }
        
        if (this.anchoredTo.length >= 1){

            // If the middle parts are bigger than their combined radius
            if (dist(
                this.anchoredTo[0].c2World.particles[0].position.x, 
                this.anchoredTo[0].c2World.particles[0].position.y,
                this.c2World.particles[0].position.x, 
                this.c2World.particles[0].position.y) >= this.anchoredTo[0].c2World.particles[0].radius + this.anchoredTo[0].c2World.particles[0].radius + 200) {
                this.newPoint(this.anchoredTo[0].c2World.particles[0].position.x, this.anchoredTo[0].c2World.particles[0].position.y);
                    // console.log(`${this.data.name} HIGH`);
                } else {
                    // console.log(`${this.data.name} LOW`);
                    this.c2World.removeForce(this.anchoredTo[0].c2World.currentPoint);

                }
        }

 

        if (this.anchoredTo.length > 1) {
            let x = 0;
            let y = 0;

            for(let a of this.anchoredTo){
                x += a.c2World.particles[0].position.x;
                y += a.c2World.particles[0].position.y;
            }

            x = x / this.anchoredTo.length;
            y = y / this.anchoredTo.length;

            this.newPoint(x, y);
        }
    } 

    newPoint(x, y){
        if (this.c2World.currentPoint != null) this.c2World.removeForce(this.c2World.currentPoint);
         
        let point = new c2.PointField(new c2.Point(x, y), 1);
        this.c2World.currentPoint = point;
        this.c2World.addForce(point);
    }

    display(){
        this.#displayBubble();
        // this.#displayRelation();
    }

    #displayRelation(){
        let weight = 1;
        switch(this.data.type){
            case BubbleType.Subgenre:
                weight = 4;
                break;
            case BubbleType.Movie:
                weight = 3;
                break;
            case BubbleType.Character:
                weight = 2;
                break;
            case BubbleType.Attribute:
                weight = 1;
                break;
        }

        if (this.isHighlighted){
            stroke(color(50, weight * 10, 90, 1)); //HSB
            strokeWeight(weight * 2);
        } else {
            stroke(color(200, 60, 50, 0.1));
            strokeWeight(weight / 2);
        }

        for(let a of this.anchoredTo){
            let parentPos = a.c2World.particles[0].position;
            let childPos = this.c2World.particles[0].position;
            fill(color(0));
            line(parentPos.x, parentPos.y, childPos.x, childPos.y);
        }
    }


    #displayBubble(){

        push();

        let p = this.c2World.particles[0];

        let size = p.radius - p.radius/10;

        let innerOpacty = 0.6;
        let innerSize = size;
        let innerColor = color(0, 0, 100);

        let outlineWeight = 0.5;
        let outlineSize = size;

        let textColor = color(0, 0, 0);
        let textOutlineSize = null;
        let myTextSize = size / 2.5;

        if (!this.isActive){
            innerOpacty = 0.8;
            innerSize = size - 2;
            innerColor = color(0, 0, 0);
            textColor = color(0, 0, 40);
            textColor.setAlpha(0.8);
        }

        if (this.isHighlighted){
            size *= 1.2;
            innerOpacty = 0.1;
            outlineWeight = 4;

            textColor = color(0, 0, 100);
            textOutlineSize = 6;

        } else if(this.isChildHighlighted){
            size *= 1.05;
            innerOpacty = 0.4;
            outlineWeight = 2;
        } 

        outlineSize = size + outlineWeight/2
        innerSize = size - 4;


        noStroke();
        if (this.isHighlighted){
            fill(color(0, 0, 100, 0.2));
            circle(p.position.x, p.position.y, size + 12);
        }
        // The image
        image(this.data.croppedImage, p.position.x - size, p.position.y - size, size * 2, size * 2)
            
        // The inner color / white
        innerColor.setAlpha(innerOpacty);
        fill(innerColor);
        noStroke();
        circle(p.position.x, p.position.y, innerSize);

        //The outline
        noFill();
        strokeWeight(outlineWeight);
        stroke(this.color);
        circle(p.position.x, p.position.y, outlineSize);

        //The text
        noStroke();
        if (textOutlineSize){
            strokeWeight(textOutlineSize);
            stroke(this.color);
        }
        fill(textColor);

        textAlign(CENTER, CENTER);  
        textSize(myTextSize);
        text(this.#lineBreakTheNames(this.data.name), p.position.x, p.position.y);    
 

        pop();
    }


    #lineBreakTheNames(name){
        let words = name.split(' ');
        let stringWithLineBreaks = words.join('\n');
        return stringWithLineBreaks;
    }

}