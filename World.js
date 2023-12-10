let allWorld;
let completeWorld;

let setupReady = false;
let controllerReady = false;
let started = false;

let backgroundImage;

let popsound;
let antipopsound;

let isTutorial = true;

//TODO: minor bug, link should be automatically added to bubbles

function preload() {
    shape = createGraphics(windowWidth, windowHeight);

    this.controller = BubbleController.getInstance();

    this.img = loadImage("./data/img/wallpaper.jpeg");

    this.popsound = loadSound("./data/popsound2.mp3");
    this.antipopsound = loadSound("./data/waterdrop.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    drawingContext.canvas.willReadFrequently = true;
    this.popsound.amp(0.5);
    this.antipopsound.amp(0.5);

    colorMode(HSB, 360, 100, 100);
    ellipseMode(RADIUS);

    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    isTutorial = true;
    setupReady = true;
    this.backgroundImage = this.img;
}

function tutorial(){
    setBackgroundImage(this.backgroundImage);
    let weight = 2;
    this.tutrad = min(width, height) / 3.5;
    let bubColour = color(0, 0, 100);
    bubColour.setAlpha(0.6);

    if (dist(mouseX, mouseY, width/2, height/2) < this.tutrad) {
        this.tutrad += 10;
        weight += 2;
        bubColour.setAlpha(0.75);
    }

    strokeWeight(weight);
    stroke(color(30, 100, 150));
    fill(bubColour);
    circle(width/2, height/2, this.tutrad);


    textAlign(CENTER, CENTER);  
    textSize(min(width, height) / 16);
    text(`GHIBBLES \nClick me to start`, width/2, height/2);    
}

function start(){
    started = true;

    // All particles/bubbles must collide
    completeWorld = new c2.World(new c2.Rect(0, 0, width, height));
    let c = new c2.Collision();
    c.strength = 0.2;
    completeWorld.addInteractionForce(c);
    completeWorld.friction = 0.01;

    dataBubbles = this.controller.getAllBubbles();
    viewBubbles = [];
    for(let bubble of dataBubbles){
        //RADIUS START
        let radius = min(width, height) / 12;
        let bub = new ViewBubble(bubble, 100, radius);

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
    let amountToPopEachTime = 4;
    let allChildBubbles = this.bubbleInactiveChildren(vBubble);
    let bubblesToPop = allChildBubbles.slice(0, amountToPopEachTime);
    if (allChildBubbles.length <= amountToPopEachTime){
        vBubble.isActive = false;
    }

    for (let i = 0; i < bubblesToPop.length; i++) {

        if (typeof this.popsound !== 'undefined') {
            this.popsound.rate(random(0.5, 2));
            this.popsound.play();
        }

        let parentParticle = vBubble.c2World.particles[0];

        let childBubble = new ViewBubble(
            bubblesToPop[i], 
            parentParticle.mass * 0.5, 
            parentParticle.radius * 0.8,
            parentParticle.position.x + random(-10, 10),
            parentParticle.position.y + random(-10, 10));
        vBubble.c2World.addParticle(childBubble.c2World.particles[0]); //Add particle to parent
        completeWorld.addParticle(childBubble.c2World.particles[0]); //Add particle to complete world

        //childBubble is a parent
        for(let bub of viewBubbles){
            for(let dChild of childBubble.data.directChildren){
                if (bub.data.id == dChild.id){
                    bub.anchoredTo.push(childBubble);
                }
            }
        }

        //childBubble is a child
        for(let bub of viewBubbles){
            for(let dChild of bub.data.directChildren){
                if (dChild.id == childBubble.data.id){
                    childBubble.anchoredTo.push(bub);
                }
            }

            let count = bub.data.directChildren.length - viewBubbles.filter(vBub => bub.data.directChildren.some(dChild => dChild.id == vBub.data.id)).length;
            bub.isActive =count > 0;
        }

        let commonItemsCount = viewBubbles.filter(vBub => childBubble.data.directChildren.some(dChild => dChild.id == vBub.data.id)).length;

        childBubble.isActive = (childBubble.data.directChildren.length - commonItemsCount > 0);
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

    if (isTutorial){
        tutorial();
        return;
    }

    update();
    let hovBub = hoverBubble();
    
    setBackgroundImage(this.backgroundImage);

    // filter(BLUR);
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

function setBackgroundImage(newImage){
    push();
        imageMode(CENTER);
        let multi = 1;

        if (newImage.width / width > newImage.height / height) {
            multi = height / newImage.height;
        } else {
            multi = width / newImage.width;
        }

        // Draw the image at the center of the canvas
        image(newImage, width / 2, height / 2, newImage.width * multi, newImage.height * multi);   
    pop();

}

function mousePressed(){
    let toPop = hoverBubble();
    
    if (isTutorial && dist(mouseX, mouseY, width/2, height/2) < this.tutrad){
        this.popsound.play();
        isTutorial = false;
    }

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
            if (typeof this.antipopsound !== 'undefined') {
                this.antipopsound.rate(random(0.5, 2));
                this.antipopsound.play();
            }
    
            console.log("REMOVE " + toPop.data.name);
            // Remove children
            for(let child of getChild([toPop])) {
                if (child.data.type != BubbleType.Genre){
                    console.log(child);
                    let index = viewBubbles.findIndex(x => x.data.id == child.data.id);
                    if (index != -1){
                        viewBubbles.splice(index, 1);
                    }
                }
            }

            if (toPop.data.type != BubbleType.Genre){
                console.log("toPop");
                console.log(toPop);
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
