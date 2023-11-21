let world;
let pointField
let timer = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSL, 360, 100, 100);
    ellipseMode(RADIUS);

    world = new c2.World(new c2.Rect(0, 0, width, height));

    for(let i=0; i<5; i++){
        let x = random(width);
        let y = random(height);
        let p = new c2.Particle(x, y);
        p.radius = random(10, height/14);
        p.color = color(random(0, 30), random(30, 60), random(20, 100));

        world.addParticle(p);
    }

    let collision = new c2.Collision();
    world.addInteractionForce(collision);

    pointField = new c2.PointField(new c2.Point(width/3, height/3), 1);
    world.addForce(pointField);

    console.log("BOWOWOW");  

    let db = new MyDatabase();
    db.createDatabase();

    
  
}

let rightSide = true;

function changeItUp(){

    console.log("CHANGE!");

    let multi = 1/8;
    if (rightSide){
        multi = 7/8;
    }

    world.removeForce();
    pointField = new c2.PointField(new c2.Point(width * multi, height * multi), 1);
    world.addForce(pointField);

}

function draw() {
    background('#cccccc');

    // pointField = new c2.PointField(new c2.Point(mouseX, mouseY), 1);
    // world.add
    world.update();
    // world.addForce(pointField);

    if (millis() >= 1000+timer) {
        rightSide = !rightSide;
        changeItUp();
        timer = millis();

    }



    for(let i=0; i<world.particles.length; i++){
        let p = world.particles[i];
        stroke('#333333');
        strokeWeight(1);
        fill(p.color);
        circle(p.position.x, p.position.y, p.radius);
        strokeWeight(2);
        point(p.position.x, p.position.y);
    }
}