let world;
let pointField
let timer = 0;

let allPossibleBubble;
let bubbles;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSL, 360, 100, 100);
    ellipseMode(RADIUS);

    //Bubbles
    let db = new MyDatabase();
    db.createDatabase();
    allPossibleBubble = BubbleController.getAllViewBubbles();

    allPossibleBubble.forEach(bub => {
        bub.isActive = true;
    });

}

function draw(){
    background(0, 0, 100);

    allPossibleBubble.forEach(bub => {
        checkSubBubbles(bub, drawBubble(bub));
    });
}

function checkAllBubbles(myFunction){
    allPossibleBubble.forEach(bub => {
        checkSubBubbles(bub, myFunction);
    });

}

function checkSubBubbles(bubble, myFunction){
    if (bubble.isActive){
        // The actions
        myFunction;

        if (bubble.children.length > 0) { 
            bubble.children.forEach(child => {
                checkSubBubbles(child, myFunction);
            });
        }
    }

}

function mousePressed(){
    console.log(allPossibleBubble);

    checkAllBubbles();

    allPossibleBubble
        .filter(bub => bub.isActive)
        .filter(bub => dist(mouseX, mouseY, bub.xPos, bub.yPos) < bub.radius)
        .forEach(bub => {
            popBubble(bub);
            
        })
}

function popBubble(parentBubble){
    parentBubble.children.forEach(child => {
        console.log(child);

        child.isActive = true;

        let space = random(-80, 80);

        child.color = color(0, 100, 80);
        child.radius -= 20;
        child.xPos = bub.xPos + space;
        child.yPos = bub.yPos + space;
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