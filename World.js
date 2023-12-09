let allWorld;
let completeWorld;

let setupReady = false;
let controllerReady = false;
let started = false;

let backgroundImage;

//TODO: bug, can remove genre bubble, have a reset button?
//TODO: minor bug, link should be automatically added to bubbles

function preload() {
    shape = createGraphics(windowWidth, windowHeight);

    this.controller = BubbleController.getInstance();

    this.img = loadImage("./data/img/wallpaper.jpeg");
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
    c.strength = 0.05;
    completeWorld.addInteractionForce(c);
    completeWorld.friction = 1;

    dataBubbles = this.controller.getAllBubbles();
    viewBubbles = [];
    for(let bubble of dataBubbles){
        let radius = min(width, height) / 10;
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
        if (random(1) < 0.005){
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
    let allChildBubbles = this.bubbleInactiveChildren(vBubble);
    let bubblesToPop = allChildBubbles.slice(0, amountToPopEachTime);
    if (allChildBubbles.length <= amountToPopEachTime){
        vBubble.isActive = false;
    }

    for (let i = 0; i < bubblesToPop.length; i++) {
        let parentParticle = vBubble.c2World.particles[0];

        let childBubble = new ViewBubble(
            bubblesToPop[i], 
            parentParticle.mass * 0.5, 
            parentParticle.radius * 0.8,
            parentParticle.position.x + random(-10, 10),
            parentParticle.position.y + random(-10, 10));
        vBubble.c2World.addParticle(childBubble.c2World.particles[0]); //Add particle to parent
        completeWorld.addParticle(childBubble.c2World.particles[0]); //Add particle to complete world

        childBubble.isActive = (childBubble.data.directChildren.length > 0);
        childBubble.anchoredTo.push(vBubble);

        viewBubbles.push(childBubble);
    }

    console.log(viewBubbles);
}


//Incase bubbles overlap, ensure the top-most is hovered
function hoverBubble(){
    if (typeof viewBubbles === 'undefined') return;
    //Logic about hovering above a bubble
    let hoveredBubbles = [];
    for(let bubble of viewBubbles){
        let p = bubble.c2World.particles[0];
        if (dist(mouseX, mouseY, p.position.x, p.position.y) < p.radius) {
            hoveredBubbles.push(bubble);
        }

        bubble.isHighlighted = false;
        bubble.isChildHighlighted = false;
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

    //Design stuff
    if (chosenBubble != null) { 
        chosenBubble.isHighlighted = true; 
        for (let c of this.getChild([chosenBubble])){
            c.isChildHighlighted = true;
        }
        for (let p of this.getParent([chosenBubble])){
            p.isChildHighlighted = true;
        }

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
    let hovBub = hoverBubble();
    
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

    background(color(0, 0, 0, 0.5));

    for(let bub of viewBubbles){
        bub.display();
    }

    showRelations(hovBub);

    // Frame rate
    noStroke();
    textSize(16);
    fill(color(100, 0.4));
    textAlign(LEFT, TOP);  
    text(int(frameRate()), 10, 10);

    textSize(16);
    fill(color(100, 0.4));
    textAlign(LEFT, BOTTOM);  
    text("LEFT CLICK: POP, RIGHT CLICK: UNPOP", 10, height-10);

}

function mousePressed(){
    let toPop = hoverBubble();
    
    if (toPop != null ){

        if (mouseButton === LEFT){
            if (toPop.data.directChildren.length > 0) { 
                popBubble(toPop); 
            } else {
                toPop.isActive = false;
            }

            this.backgroundImage = toPop.data.image;
        }

        if (mouseButton === RIGHT) {
            console.log("REMOVE " + toPop.data.name);
            // Remove children
            for(let child of getChild([toPop])) {
                console.log(child);
                if (child.data.type != BubbleType.Genre){
                    viewBubbles.splice(viewBubbles.findIndex(x => x.data.id == child.data.id), 1);
                }
            }

            if (toPop.data.type != BubbleType.Genre){
                // Remove clicked one
                viewBubbles.splice(viewBubbles.findIndex(x => x.data.id == toPop.data.id), 1);
            }

            toPop.isActive = true;
        }
    }
}

function getChild(checkBubbles, index){
    let bubs = [];

    //Check through list that was given
    for(let checkBub of checkBubbles){

        //All all the viewBubbles, which is the corresponding one with the correct is as an anchor
        for(let bub of viewBubbles){
            for (let anchor of bub.anchoredTo){
                if (checkBub.data.id == anchor.data.id){

                    let tempColor = color(hue(checkBub.data.color), saturation(checkBub.data.color), brightness(checkBub.data.color) - 20);
                    tempColor.setAlpha(1 - constrain((index * 0.2), 0.1, 1));
                    stroke(tempColor);
                    // strokeWeight(getBubbleTypeNum(anchor.data.type / 2, true));
                    strokeWeight(constrain(6 - index * 1.5, 0.5, 10));
                    // strokeWeight(getBubbleTypeNum(checkBub.data.type, true));
                    line(
                        bub.c2World.particles[0].position.x, 
                        bub.c2World.particles[0].position.y, 
                        anchor.c2World.particles[0].position.x, 
                        anchor.c2World.particles[0].position.y);
                    

                    bubs.push(bub);

                    for(let cBub of getChild([bub], index + 1)){
                        bubs.push(cBub);
                    }

                }
            }
        }
    }

    return bubs;
}

function getParent(checkBubbles, index) {
    let bubs = [];

    //Check through list that was given
    for(let checkBub of checkBubbles){
        for (let a of checkBub.anchoredTo){

            let tempColor = color(hue(checkBub.data.color), saturation(checkBub.data.color), brightness(checkBub.data.color) + 20);
            tempColor.setAlpha(1 - constrain((index * 0.2), 0.1, 1));
            stroke(tempColor);
            // strokeWeight(getBubbleTypeNum(a.data.type / 2, true));
            strokeWeight(constrain(6 - index * 1.5, 0.5, 10));
            line(
                checkBub.c2World.particles[0].position.x, 
                checkBub.c2World.particles[0].position.y, 
                a.c2World.particles[0].position.x, 
                a.c2World.particles[0].position.y)

            bubs.push(a);
        }

        for (let a of getParent(checkBub.anchoredTo, index + 1)){
            bubs.push(a);
        }
    }

    return bubs;
}

function showRelations(bubble){
    if (bubble == null) return;

    getParent([bubble], 0);
    getChild([bubble], 0);
}

function getBubbleTypeNum(type, reverse = false){
    let num = 0;
    switch(type){
        case BubbleType.Genre:
            num = 1;
            break;
        case BubbleType.Subgenre:
            num = 2;
            break;
        case BubbleType.Movie:
            num = 3;
            break;
        case BubbleType.Character:
            num = 4;
            break;
        case BubbleType.Attribute:
            num = 5;
            break;
    }

    if (reverse) { num = 6 - num; }

    return num;
}
