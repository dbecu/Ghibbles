let dataBubbles;
let viewBubbles;

let canvas;

let controller;

let img;
let maskShape;
let editImg;

// YA TODO: Have line between relate bubbles
// YA TODO: Bubbles should always stay in frame
// YA TODO: Bubbles should always stay in frame

//TODO: Push nonrelated bubbles away from each other
//TODO: Put colors to bubbles
//TODO: Put images to bubbles
//TODO: Child bubbles can move dynamically around parent. BUt they bump on children on same level (same type?)

//TODO: Bubble overlap
//TODO: CHild bubble with more than one parent anchor has n amount of colours

function preload() {
    createCanvas(windowWidth, windowHeight);
    this.controller = BubbleController.getInstance();
    //Creating mask
    // this.img = loadImage("./data/img/howl.png");
}
function setup() {
    resizeCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    ellipseMode(RADIUS);

    // setupImage();

    dataBubbles = this.controller.getAllBubbles();

    viewBubbles = [];
    for(let bubble of dataBubbles){
        let amount = 100;
        let radius = min(width, height) / 8;

        let bub = new ViewBubble(
            bubble, 
            radius, 
            random(amount, width - amount), 
            random(amount, height - amount));
        viewBubbles.push(bub);
    }

    console.log(viewBubbles);

    // console.log(viewBubbles[0].image);
    // console.log(this.editImg);
    // image(viewBubbles[0].image, 0, 0);
    // image(viewBubbles[0].getImageFromPath(), 100, 100);
    // image(this.img, 0, 0); 

    
}

function setupImage(){
    imageMode(CORNER);
    length = 100;
    newHeight = this.img.height;
    newWidth = this.img.width;

    //if height is cmaller
    if (this.img.height < this.img.width){
        newHeight = length;
        newWidth = (this.img.width / this.img.height) * 100;
    } else {
        newWidth = length;
        newHeight = (this.img.height / this.img.width) * 100;
    }
    this.img.resize(newWidth, newHeight);

    widthStartPoint = (newWidth / 2) - (length / 2);
    heightStartPoint = (newHeight / 2) - (length / 2);

    this.editImg = createImage(length, length);
    this.editImg.loadPixels();
    for (let x = 0; x < this.editImg.width; x++) {
    for (let y = 0; y < this.editImg.height; y++) {
            let c = this.img.get(widthStartPoint + x, heightStartPoint + y);
            // console.log(c);
            this.editImg.set(x, y, c);
        }
    }
    this.editImg.updatePixels();

    this.maskShape = createGraphics(length, length);
    this.maskShape.circle(length/2, length/2, length);

    this.editImg.mask(this.maskShape);
    tint(color(100, 80, 80));
    image(this.editImg, 0, 0); 
}

function draw(){
    background(0, 0, 100);

    //Test
    // image(this.img, 0, 0);
    // image(this.maskShape, 0, 0);
    // image(this.editImg, 0, 0); 
    // console.log("viewBubbles[0].image");


    //Framerate
    textSize(16);
    fill(0);
    textAlign(LEFT, TOP);  
    text(int(frameRate()), 10, 10);

    //Check collisions
    //Collision & Overlapping Rules
    //1. Bubbles of the same type will always COLLIDE
    //2. Bubbles that are active will always COLLIDE with other active bubbles
    //3. Inactive bubbles can have it's children OVERLAP itself
    //4. Inactive bubbles COLLIDE with non-children
    for(let bubble of viewBubbles){
        for(let otherBubble of viewBubbles){
            let direction = p5.Vector.sub(
                createVector(otherBubble.xPos, otherBubble.yPos), 
                createVector(bubble.xPos, bubble.yPos));

            let bubblesInCollision = bubble.radius + otherBubble.radius >= direction.mag();
            bubble.inCollision = bubblesInCollision;
            otherBubble.inCollision = bubblesInCollision;

            if (bubblesInCollision) {

                let sameBubble = otherBubble != bubble;
                let sameType = otherBubble.data.type == bubble.data.type;
                let bothActive = otherBubble.isActive && bubble.isActive;
                let inactiveParent = (otherBubble.isActive && bubble.anchoredTo.includes(otherBubble))
                    || (bubble.isActive && otherBubble.anchoredTo.includes(bubble));

                if (sameBubble && (sameType || bothActive || inactiveParent)) {
                    direction.normalize();

                    bubble.lerpToNewDirection(degrees(direction.rotate(PI).heading()));
                    otherBubble.lerpToNewDirection(degrees(direction.rotate(PI).heading()));

                    bubble.setNewSpeed((bubble.speed + otherBubble.speed)/2);
                    otherBubble.setNewSpeed((bubble.speed + otherBubble.speed)/2);

                    if (bubble.data.id == 21) {
                        console.log(`${bubble.data.name} ${otherBubble.data.name} `);
                    }
                }
            }
        }

        update(bubble);
        display(bubble);
    }
}


function pressedOnBubble(bubble){
    if (dist(mouseX, mouseY, bubble.xPos, bubble.yPos) < bubble.radius) {
        popBubble(bubble);
    }

}

function checkPoppable(vBubble){
    let hasChildren = vBubble.data.directChildren.length > 0;

    if (hasChildren){     
        return vBubble;
    }
}

function mousePressed(){
    let toPop = hoverBubble();
    if (toPop != null && checkPoppable(toPop)) { 
        popBubble(toPop); 
    }
    
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
                viewBubbles[index].addToAnchorList(vBubble);
                // viewBubbles[index].anchoredTo.push(vBubble);
            }
        }
    }  

    return bubblesToPop;
}

function popBubble(vBubble){
    //Finds which child bubble is already popped active from other parent bubble
    let amountToPopEachTime = 2;
    let bubblesToPop = this.bubbleInactiveChildren(vBubble).slice(0, amountToPopEachTime);
    console.log(bubblesToPop);


    let randomRotate = random(TWO_PI);
    for (let i = 0; i < bubblesToPop.length; i++) {
        //Creating new viewBubble
        let childBubble = new ViewBubble(bubblesToPop[i], vBubble.radius * 0.8, vBubble.xPos, vBubble.yPos);

        //Deciding initial angle
        let angle = ((TWO_PI / bubblesToPop.length * i) + randomRotate) % 360; // Calculate angle for each smaller circle
        childBubble.initialAnglePos = angle;
        let newX = vBubble.xPos + random(-50, 50);
        let newY = vBubble.yPos + random(-50, 50);
        // childBubble.setNewPosition(vBubble.xPos + random(-50, 50), vBubble.yPos + random(-50, 50));
        // childBubble.setNewPosition(100, 100);
        childBubble.setNewPosition(newX, newY);

        //Design aspects of bubble
        childBubble.color = color(
            hue(vBubble.color), 
            saturation(vBubble.color), 
            brightness(vBubble.color) - 10);
        childBubble.color.setAlpha(0.8);

        childBubble.anchoredTo.push(vBubble);
        viewBubbles.push(childBubble);
    }

    console.log(viewBubbles);
}

function hoverBubble(){
    let hoveredBubbles = [];
    for(let bubble of viewBubbles){
        if (dist(mouseX, mouseY, bubble.xPos, bubble.yPos) < bubble.radius) {
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
        return chosenBubble;
    }
}

function display(vBubble){
    vBubble.display();
}
function update(vBubble){
    vBubble.isActive = (this.bubbleInactiveChildren(vBubble).length > 0);
    vBubble.update();
    hoverBubble();
}