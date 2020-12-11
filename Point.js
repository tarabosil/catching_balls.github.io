class Point {
    constructor(x, y, hu, firework) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.lifespan = 500;
      this.hu = hu;
      this.acc = createVector(0, 0);
      if (this.firework) {
        this.vel = createVector(0, 0); // second parameter like random(-12, -8) means that point goes up
      } else {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2, 10));
      }
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      if (!this.firework) {
        this.vel.mult(0.9);
        this.lifespan -= 2;
      }
      this.vel.add(this.acc);
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
        strokeWeight(2);
        stroke(255, 255, this.hu, this.lifespan);
      } else {
        strokeWeight(6);
        stroke(255, 255, this.hu);
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