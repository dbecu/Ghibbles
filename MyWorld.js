let world;
let pointField
let timer = 0;

let nestedBubbles;
let bubbleInstances;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    ellipseMode(RADIUS);

    //Bubbles
    let db = new MyDatabase();
    db.createDatabase();
    nestedBubbles = BubbleController.getAllViewBubbles();

    nestedBubbles.forEach(bub => {
        bub.isActive = true;
    });

}

function draw(){
    background(0, 0, 100);

    checkAllBubbles(function(bubble){
        if (bubble.isActive){
            drawBubble(bubble);
        }
    });
}

function checkAllBubbles(func){
    for (let i = 0; i < nestedBubbles.length; i++){
        let result = checkNestedBubbles(nestedBubbles[i], func);
        if (result != null) {
            return result;
        }
    }
}

function checkNestedBubbles(bubble, func){
    // The actions
    let result = func(bubble);
    if (result != null) {
        return result;
    }

    if (bubble.children.length > 0) { 
        for (let i = 0; i < bubble.children.length; i++){
            let child = bubble.children[i];
            result = checkNestedBubbles(child, func);
            if (result != null) {
                return result;
            }
        }
    }
}

function pressedOnBubble(bubble){
    if (bubble.isActive && dist(mouseX, mouseY, bubble.xPos, bubble.yPos) < bubble.radius) {
        popBubble(bubble);
    }

}

function checkPoppable(bubble){
    if (bubble.isActive 
            && dist(mouseX, mouseY, bubble.xPos, bubble.yPos) < bubble.radius //click on circle
            && bubble.children.length > 0 //has children
            && bubble.children.find(child => !child.isActive) != null) {  //at least one child is inactive

            return bubble;
    }
}

function mousePressed(){
    let bubbleToPop = checkAllBubbles(checkPoppable);
    console.log(bubbleToPop);
    if (bubbleToPop != null) { 
        popBubble(bubbleToPop); 
    }
}

function popBubble(parentBubble){
    let distanceFromParent = parentBubble.radius/2;
    let numChildren = parentBubble.children.length;
    for (let i = 0; i < numChildren; i++) {
        parentBubble.children[i].isActive = true;

        let angle = TWO_PI / numChildren * i; // Calculate angle for each smaller circle
        let offsetX = cos(angle) * (parentBubble.radius + distanceFromParent); // X-coordinate offset from the main circle
        let offsetY = sin(angle) * (parentBubble.radius + distanceFromParent); // Y-coordinate offset from the main circle
        let circleX = parentBubble.xPos + offsetX; // X-coordinate of the smaller circle
        let circleY = parentBubble.yPos + offsetY; // Y-coordinate of the smaller circle
        
        parentBubble.children[i].color = color(
            hue(parentBubble.color), 
            saturation(parentBubble.color), 
            brightness(parentBubble.color) - 10);

        parentBubble.children[i].radius = parentBubble.radius * 0.6;
        parentBubble.children[i].xPos = circleX;
        parentBubble.children[i].yPos = circleY;    
    }
}

function drawBubble(bubble){
    // noStroke();
    fill(bubble.color);
    circle(bubble.xPos, bubble.yPos, bubble.radius);
    strokeWeight(2);
    // point(bubble.xPos, bubble.yPos);

    fill(color(0, 0, 0));
    textAlign(CENTER);
    text(bubble.bubble.name, bubble.xPos, bubble.yPos);
}