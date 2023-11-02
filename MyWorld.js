let world;
let pointField
let timer = 0;

let nestedBubbles;
let bubbleInstances;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSL, 360, 100, 100);
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
        console.log("checkNestedBubbles1-" + result.bubble.name)
        return result;
    }

    if (bubble.children.length > 0) { 
        for (let i = 0; i < bubble.children.length; i++){
            let child = bubble.children[i];
            result = checkNestedBubbles(child, func);
            if (result != null) {
                console.log("checkNestedBubbles-" + result.bubble.name)
                return result;
            }

        }
    }

    // console.log("checkNestedBubbles- &&&")

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

            console.log("checkPoppable: " + bubble.bubble.name);
            return bubble;
    }
}

function mousePressed(){
    // checkAllBubbles(pressedOnBubble);'
    let bubbleToPop = checkAllBubbles(checkPoppable);
    console.log(bubbleToPop);
    if (bubbleToPop != null) { 
        console.log("!!!!!");
        popBubble(bubbleToPop); 
    }
}

function popBubble(parentBubble){
    parentBubble.children.forEach(child => {
        child.isActive = true;

        let space = random(-80, 80);

        child.color = color(0, 100, 80);
        child.radius -= 20;
        child.xPos = parentBubble.xPos + space;
        child.yPos = parentBubble.yPos + space;
    })

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