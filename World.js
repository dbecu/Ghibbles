let allWorld;
let completeWorld;

let setupReady = false;
let controllerReady = false;
let started = false;

let backgroundImage;

function preload() {
    createCanvas(windowWidth, windowHeight);
    shape = createGraphics(windowWidth, windowHeight);

    this.controller = BubbleController.getInstance();

    this.img = loadImage("./data/img/howl.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    drawingContext.canvas.willReadFrequently = true;

    colorMode(HSB, 360, 100, 100);
    ellipseMode(RADIUS);

    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    setupReady = true;
    this.backgroundImage = this.img;
}

function start(){
    started = true;

    // All particles/bubbles must collide
    completeWorld = new c2.World(new c2.Rect(0, 0, width, height));
        let c = new c2.Collision();
    c.strength = 0.2;
    completeWorld.addInteractionForce(c);

    dataBubbles = this.controller.getAllBubbles();
    viewBubbles = [];
    for(let bubble of dataBubbles){
        let radius = min(width, height) / 14;
        let bub = new ViewBubble(bubble, 10, radius);

        completeWorld.addParticle(bub.c2World.particles[0]);
        viewBubbles.push(bub);
    }
}

function update(){    
    completeWorld.update();

    for(let bub of viewBubbles){
        bub.update();
    }

    for(let bub of viewBubbles.filter(x => x.data.type == BubbleType.Genre)){
        if (random(1) < 0.01){
            // radius of where they should move
            let rad = 50;
            let pos = bub.c2World.particles[0].position;

            let multi = 2;
            let x = constrain(pos.x + random(-rad, rad), rad * multi, width - rad * multi);
            let y = constrain(pos.y + random(-rad, rad), rad * multi, height - rad * multi);

            newPoint(bub, x, y);
        }
    }
}

function genreBubbleChangeSmallSpots(){

}

function genreBubbleChangeBigSpots(){

}


function newPoint(vBubble, x, y){
    vBubble.c2World.removeForce(vBubble.c2World.currentPoint);
     
    let point = new c2.PointField(new c2.Point(x, y), 1);
    vBubble.c2World.currentPoint = point;
    vBubble.c2World.addForce(point);
}

function bubbleInactiveChildren(vBubble){
    //Finds which child bubble is already popped active from other parent bubble
    let bubblesToPop = [];

    //For each child in vBubble (bubble that wants to be popped)
    for (let child of vBubble.data.directChildren) {
        //Is child already in viewBubbles? If not, to below
        if (!viewBubbles.some(v => v.data.id == child.id)){
            bubblesToPop.push(child);
        } else {
            //Added parent!
            let index = viewBubbles.findIndex(bub => bub.data.id == child.id);
            if (!viewBubbles[index].anchoredTo.includes(vBubble)){
                viewBubbles[index].anchoredTo.push(vBubble);
            }
        }
    }  

    return bubblesToPop;
}

function popBubble(vBubble){
    //Finds which child bubble is already popped active from other parent bubble
    let amountToPopEachTime = 2;
    let bubblesToPop = this.bubbleInactiveChildren(vBubble).slice(0, amountToPopEachTime);

    for (let i = 0; i < bubblesToPop.length; i++) {
        let parentParticle = vBubble.c2World.particles[0];

        let childBubble = new ViewBubble(
            bubblesToPop[i], 
            parentParticle.mass * 0.5, 
            parentParticle.radius * 0.8); //,
            // parentParticle.position.x,
            // parentParticle.position.y);
        vBubble.c2World.addParticle(childBubble.c2World.particles[0]); //Add particle to parent
        completeWorld.addParticle(childBubble.c2World.particles[0]); //Add particle to complete world
        
        childBubble.anchoredTo.push(vBubble);
        viewBubbles.push(childBubble);
    }

    console.log(viewBubbles);
}


//Incase bubbles overlap, ensure the top-most is hovered
function hoverBubble(){
    //Logic
    let hoveredBubbles = [];
    for(let bubble of viewBubbles){
        let p = bubble.c2World.particles[0];
        if (dist(mouseX, mouseY, p.position.x, p.position.y) < p.radius) {
            hoveredBubbles.push(bubble);
        }

        bubble.isHighlighted = false;
    }

    let chosenBubble = null;
    if (hoveredBubbles.length > 0){
        let typeOrder = [BubbleType.Genre, BubbleType.Subgenre, BubbleType.Movie, BubbleType.Character, BubbleType.Attribute]
        for (let type of typeOrder) {
            for (let obj of hoveredBubbles) {
                if (obj.data.type == type) {
                    chosenBubble = obj; // Return the first object with the desired type
                }
            }
        }
    }

    if (chosenBubble != null) { 
        chosenBubble.isHighlighted = true; 

        if (chosenBubble.isHighlighted){
            console.log("!!!");
        }

        return chosenBubble;
    }
}

function draw() {
    if (setupReady && controllerReady && !started){
        start();
        return;
    }

    if (!started) return;

    update();
    hoverBubble();
    background('#cccccc');
    
    push();
        imageMode(CENTER);
        let multi = 1;

        if (this.backgroundImage.width / width > this.backgroundImage.height / height) {
            multi = height / this.backgroundImage.height;
        } else {
            multi = width / this.backgroundImage.width;
        }

        // Draw the image at the center of the canvas
        image(this.backgroundImage, width / 2, height / 2, this.backgroundImage.width * multi, this.backgroundImage.height * multi);   
    pop();


    for(let bub of viewBubbles){
        bub.display();
    }

    textSize(16);
    fill(0);
    textAlign(LEFT, TOP);  
    text(int(frameRate()), 10, 10);
}

function mousePressed(){
    let toPop = hoverBubble();
    
    if (toPop != null ){

        if (mouseButton === LEFT){
            if (toPop.data.directChildren.length > 0) { 
                popBubble(toPop); 
            }

            if (toPop.anchoredTo.length > 0){
                this.backgroundImage = toPop.anchoredTo[0].data.image;
            }
        }

        if (mouseButton === RIGHT) {
            console.log("REMOVE " + toPop.data.name);
            // Remove children
            for(let child of getChild([toPop])) {
                console.log(child);
                viewBubbles.splice(viewBubbles.findIndex(x => x.data.id == child.data.id), 1);
            }

            if (toPop.data.type != BubbleType.Genre){
                // Remove clicked one
                viewBubbles.splice(viewBubbles.findIndex(x => x.data.id == toPop.data.id), 1);
            }
        }
    }
}

function getChild(checkBubbles){
    let bubs = [];

    //Check through list that was given
    for(let checkBub of checkBubbles){

        //All all the viewBubbles, which is the corresponding one with the correct is as an anchor
        for(let bub of viewBubbles){
            for (let anchor of bub.anchoredTo){
                if (checkBub.data.id == anchor.data.id){
                    bubs.push(bub);

                    for(let cBub of getChild([bub])){
                        bubs.push(cBub);
                    }

                }
            }
        }
    }

    return bubs;
}

