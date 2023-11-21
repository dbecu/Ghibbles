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
        viewBubbles.push(new ViewBubble(bubble, random(100, width - 100), random(100, height - 100)));
    }
}

function draw(){
    background(0, 0, 100);
    for(let bubble of viewBubbles){
        bubble.update();
        display(bubble);
    }

    for(let bubble of viewBubbles.filter(bub => bub.data.type == BubbleType.Genre)){
        if (random(100) < 1) {
            let newX = constrain(bubble.xPos += random(-100, 100), 50, width-50)
            let newY = constrain(bubble.yPos += random(-100, 100), 50, height-50)
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
            viewBubbles[index].anchoredTo.push(vBubble);
        }
    }  

    let distanceFromParent = vBubble.radius/2;
    let randomRotate = random(TWO_PI);
    for (let i = 0; i < bubblesToPop.length; i++) {
        let childBubble = new ViewBubble(bubblesToPop[i], vBubble.xPos, vBubble.yPos);

        let angle = ((TWO_PI / bubblesToPop.length * i) + randomRotate) % 360; // Calculate angle for each smaller circle
        childBubble.initialAnglePos = angle;

        let offsetX = cos(angle) * (vBubble.radius + distanceFromParent); // X-coordinate offset from the main circle
        let offsetY = sin(angle) * (vBubble.radius + distanceFromParent); // Y-coordinate offset from the main circle
        let circleX = vBubble.xPos + offsetX; // X-coordinate of the smaller circle
        let circleY = vBubble.yPos + offsetY; // Y-coordinate of the smaller circle
        childBubble.setNewPosition(circleX, circleY);

        childBubble.color = color(
            hue(vBubble.color), 
            saturation(vBubble.color), 
            brightness(vBubble.color) - 10);

        childBubble.radius = vBubble.radius * 0.8;
        // childBubble.xPos = circleX;
        // childBubble.yPos = circleY;    

        childBubble.anchoredTo.push(vBubble);
        viewBubbles.push(childBubble);

        // console.log(childBubble);

    }
}

function display(vBubble){
    vBubble.display();
}