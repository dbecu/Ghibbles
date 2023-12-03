class ViewBubble{
    constructor(bubble, mass, radius, x = null, y = null){
        this.data = bubble;        
        this.color = bubble.color;

        this.isActive = true;
        this.isHighlighted = false;   

        this.anchoredTo = [];

        //test
        this.c2World = new c2.World(new c2.Rect(0, 0, width, height));
        this.c2World.addInteractionForce(new c2.Gravitation(0.5));

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
        this.c2World.removeForce(this.c2World.currentPoint);
         
        let point = new c2.PointField(new c2.Point(x, y), 1);
        this.c2World.currentPoint = point;
        this.c2World.addForce(point);
    }

    display(){
        this.#displayRelation();
        this.#displayBubble();
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
            line(parentPos.x, parentPos.y, childPos.x, childPos.y);
        }
    }


    #displayBubble(){
        let p = this.c2World.particles[0];

        if (this.isHighlighted) {
            strokeWeight(4);
            stroke(color(50, 100, 100, 1)); 
        } else {
            strokeWeight(1);
            stroke(color(0, 1));
        }

        if (this.isActive){
            fill(this.color);
        }else {
            fill(color(10, 10, 10, 0.1));
        }

        circle(p.position.x, p.position.y, p.radius - p.radius/10);
        textAlign(CENTER, CENTER);  
        text(this.data.name, p.position.x, p.position.y);    

    }

}