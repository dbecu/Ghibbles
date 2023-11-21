let num = 3;
let springs = [];

function setup() {
  createCanvas(710, 400);
  noStroke();

  springs[0] = new Test(240, 260, 40, 0.98, 8.0, 0.1, 0);
  springs[1] = new Test(320, 210, 120, 0.95, 9.0, 0.1, 1);
  springs[2] = new Test(180, 170, 200, 0.90, 9.9, 0.1, 2);
}

function draw() {
  background(51);

  for (let i = 0; i < num; i++) {
    springs[i].update();
    springs[i].display();
  }

  if (random(100) < 1) {
    springs[0].changeAnchorPos(random(710), random(400));
  }
}

function mousePressed() {
  for (let i = 0; i < num; i++) {
    springs[i].pressed();
  }
}

function mouseReleased() {
  for (let i = 0; i < num; i++) {
    springs[i].released();
  }
}

// Spring class
class Test {
  constructor(xPos, yPos, size, damp, mass, sprintInput, id){
      // Screen values
    this.xPos = xPos;
    this.yPos= yPos;
  
    this.size = 20;
    this.size = size;
  
    this.over = false;
    this.move = false;
  
    // Spring simulation constants
    this.mass = mass;       // Mass
    this.k = 0.2;         // Spring constant
    this.k = sprintInput;
    this.damp = damp;       // Damping
    this.anchorPosX = xPos;  // Rest position X
    this.anchorPosY = yPos;  // Rest position Y
  
    // Spring simulation variables
    //float pos = 20.0;   // Position
    this.velx = 0.0;      // X Velocity
    this.vely = 0.0;      // Y Velocity
    this.accel = 0;       // Acceleration
    this.force = 0;       // Force
  
    this.id = id;
  }

  update() {


    this.force = -this.k * (this.yPos - this.anchorPosY); // f=-ky
    this.accel = this.force / this.mass;                  // Set the acceleration, f=ma == a=f/m
    this.vely = this.damp * (this.vely + this.accel);     // Set the velocity
    this.yPos = this.yPos + this.vely;                  // Updated position

    this.force = -this.k * (this.xPos - this.anchorPosX); // f=-ky
    this.accel = this.force / this.mass;                  // Set the acceleration, f=ma == a=f/m
    this.velx = this.damp * (this.velx + this.accel);     // Set the velocity
    this.xPos = this.xPos + this.velx;                  // Updated position


  
  }

  changeAnchorPos(x, y){
    this.anchorPosX = x;
    this.anchorPosY = y;
  }




  display() {
    if (this.over) {
      fill(153);
    } else {
      fill(255);
    }
    ellipse(this.xPos, this.yPos, this.size, this.size);
  }

}