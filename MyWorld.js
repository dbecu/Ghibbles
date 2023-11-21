let world;
let pointField
let timer = 0;

let nestedBubbles;
let bubbleInstances;

let dataBubbles;
let viewBubbles;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    ellipseMode(RADIUS);

    //Testing
    bdb = new BubbleDatabase();
    bdb.createDatabase();
    dataBubbles = BubbleController.getAllBubbles();

    viewBubbles = [];
    for(let bubble of dataBubbles){
        viewBubbles.push(new ViewBubble(bubble));
    }
}

function draw(){
    background(0, 0, 100);
    for(let bubble of viewBubbles){
        drawBubble(bubble);
    }
}


function pressedOnBubble(bubble){
    if (dist(mouseX, mouseY, bubble.xPos, bubble.yPos) < bubble.radius) {
        popBubble(bubble);
    }

}

function checkPoppable(vBubble){
    // let itselfIsActive = viewBubbles.includes(vBubble);
    let clickOnCircle = dist(mouseX, mouseY, vBubble.xPos, vBubble.yPos) < vBubble.radius;
    let hasChildren = vBubble.data.directChildren.length > 0;

    // Check if bubble that wants to be popped has children that is already active on screen
    let inactiveBubbles = 0;
    for (let child of vBubble.data.directChildren) {
        if (!viewBubbles.some(v => v.data.id == child.id)){
            inactiveBubbles++
        }
    }      
    
    if (clickOnCircle && hasChildren && !(inactiveBubbles <= 0)) {      
        return vBubble;
    }
}

function mousePressed(){
    let toPop = null;

    for(let bubble of viewBubbles){
        toPop = checkPoppable(bubble);
        if (toPop != null) { 
            popBubble(toPop); 
        }
    }
}

function popBubble(vBubble){
    let distanceFromParent = vBubble.radius/2;

    let bubblesToPop = [];
    for (let child of vBubble.data.directChildren) {
        if (!viewBubbles.some(v => v.data.id == child.id)){
            bubblesToPop.push(child);

        } else {
            console.log("popBubble!!");
            console.log(child);

        }
    }  

    // for(let daravb of bubblesToPop) {
    for (let i = 0; i < bubblesToPop.length; i++) {
        let childBubble = new ViewBubble(bubblesToPop[i]);

        let angle = TWO_PI / bubblesToPop.length * i; // Calculate angle for each smaller circle
        let offsetX = cos(angle) * (vBubble.radius + distanceFromParent); // X-coordinate offset from the main circle
        let offsetY = sin(angle) * (vBubble.radius + distanceFromParent); // Y-coordinate offset from the main circle
        let circleX = vBubble.xPos + offsetX; // X-coordinate of the smaller circle
        let circleY = vBubble.yPos + offsetY; // Y-coordinate of the smaller circle
        
        childBubble.color = color(
            hue(vBubble.color), 
            saturation(vBubble.color), 
            brightness(vBubble.color) - 10);

        childBubble.radius = vBubble.radius * 0.8;
        childBubble.xPos = circleX;
        childBubble.yPos = circleY;    

        viewBubbles.push(childBubble);

        // console.log(childBubble);

    }
}

function drawBubble(vBubble){
    noFill();
    stroke(color(255, 0, 0, 10));
    // fill(bubble.color);
    circle(vBubble.xPos, vBubble.yPos, vBubble.radius);
    strokeWeight(2);
    // point(bubble.xPos, bubble.yPos);

    noStroke();
    fill(color(0, 0, 0));
    textAlign(CENTER);
    text(vBubble.data.name, vBubble.xPos, vBubble.yPos);
}