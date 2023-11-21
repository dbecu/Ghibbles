//https://p5js.org/examples/simulate-springs.html

class SpringMovement {
    constructor(xPos, yPos, damp, mass, springInput){
        // Screen values
      this.xPos = xPos;
      this.yPos= yPos;
    
      // Spring simulation constants
      this.mass = mass;       // Mass
      this.k = 0.2;         // Spring constant
      this.k = springInput;
      this.damp = damp;       // Damping
      this.anchorPosX = xPos;  // Rest position X
      this.anchorPosY = yPos;  // Rest position Y
    
      // Spring simulation variables
      //float pos = 20.0;   // Position
      this.velx = 0.0;      // X Velocity
      this.vely = 0.0;      // Y Velocity
      this.accel = 0;       // Acceleration
      this.force = 0;       // Force
    }

    changeAnchorPos(x, y){
        this.anchorPosX = x;
        this.anchorPosY = y;
      }
  
    updatePosition() {
      this.force = -this.k * (this.yPos - this.anchorPosY); // f=-ky
      this.accel = this.force / this.mass;                  // Set the acceleration, f=ma == a=f/m
      this.vely = this.damp * (this.vely + this.accel);     // Set the velocity
      this.yPos = this.yPos + this.vely;                  // Updated position
  
      this.force = -this.k * (this.xPos - this.anchorPosX); // f=-ky
      this.accel = this.force / this.mass;                  // Set the acceleration, f=ma == a=f/m
      this.velx = this.damp * (this.velx + this.accel);     // Set the velocity
      this.xPos = this.xPos + this.velx;                  // Updated position

      return createVector(this.xPos, this.yPos);
    }
  }