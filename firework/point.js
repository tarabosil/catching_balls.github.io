class Point {
    constructor(x, y, hu, color, firework, size) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.lifespan = 700;
      this.hu = hu;
      this.color = color;
      this.size = size;
      this.acc = createVector(0, 0);
      if (this.firework) {
        this.vel = createVector(0, 0); // second parameter like random(-12, -8) means that point goes up
      } else {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(1, 10));
      }
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      if (!this.firework) {
        if (this.size < 60){
          this.vel.mult(0.85);
        } else if (this.size >= 60 && this.size < 90) {
          this.vel.mult(0.9);
        } else {
          this.vel.mult(0.96);
        }
        this.lifespan -= 2;
      }
      // this.vel.add(this.acc);   // if commented then freeze points, else falling down
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  
    done() {
      if (this.lifespan < 0) {
        return true;
      } else {
        return false;
      }
    }
  
    show() {
  
      if (!this.firework) {
        if (this.size < 60){
          strokeWeight(2);
        } else if (this.size >= 60 && this.size < 90) {
          strokeWeight(3);
        } else {
          strokeWeight(4);
        }
        colorMode(HSL, 359, 100, 100);
        // last parameter defines transaprency
        stroke(this.color, 94, 72, this.lifespan / 500);
      }
      point(this.pos.x, this.pos.y);
    } 

    floor() {
      if (this.pos.y >= height - 2) {
        this.pos.y = height - 2;
        this.vel.y *= random(1, 3) * -1;
      }
    }
  }