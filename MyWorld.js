let dataBubbles;
let viewBubbles;

let canvas;

// YA TODO: Have line between relate bubbles
// YA TODO: Bubbles should always stay in frame
// YA TODO: Bubbles should always stay in frame

//TODO: Push nonrelated bubbles away from each other
//TODO: Put colors to bubbles
//TODO: Put images to bubbles
//TODO: Child bubbles can move dynamically around parent. BUt they bump on children on same level (same type?)

//TODO: Bubble overlap
//TODO: CHild bubble with more than one parent anchor has n amount of colours

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    ellipseMode(RADIUS);

    //Testing
    bdb = new BubbleDatabase();
    bdb.createDatabase();
    dataBubbles = BubbleController.getAllBubbles();

    viewBubbles = [];
    for(let bubble of dataBubbles){
        let amount = 100;
        let bub = new ViewBubble(bubble, random(amount, width - amount), random(amount, height - amount));
        bub.radius = min(width, height) / 8;
        viewBubbles.push(bub);
    }
}

function draw(){
    background(0, 0, 100);

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

            if (bubble.radius + otherBubble.radius >= direction.mag()){

            let sameBubble = otherBubble != bubble;
            let sameType = otherBubble.data.type == bubble.data.type;
            let bothActive = otherBubble.isActive && bubble.isActive;
            let inactiveParent = (otherBubble.isActive && bubble.anchoredTo.includes(otherBubble))
                || (bubble.isActive && otherBubble.anchoredTo.includes(bubble));

            if (sameBubble && (sameType || bothActive || inactiveParent)) {
                direction.normalize();

                let xDelta = direction.x * (bubble.radius + otherBubble.radius);
                let yDelta = direction.y * (bubble.radius + otherBubble.radius);
                
                bubble.setNewPosition(bubble.xPos - xDelta, bubble.yPos - yDelta);
                // otherBubble.setNewPosition(bubble.xPos - -xDelta, bubble.yPos - -yDelta);
                }
            }
        }

        update(bubble);
        display(bubble);
    }

    for(let bubble of viewBubbles.filter(bub => bub.data.type == BubbleType.Genre)){
        if (random(100) < 0.1) {
            let randomIndex = 40;

            let newX = bubble.xPos += random(-randomIndex, randomIndex);
            let newY = bubble.yPos += random(-randomIndex, randomIndex);
            bubble.setNewPosition(newX, newY);
        }
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
        let childBubble = new ViewBubble(bubblesToPop[i], vBubble.xPos, vBubble.yPos);

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

        childBubble.radius = vBubble.radius * 0.8;

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