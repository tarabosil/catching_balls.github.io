class Firework {
    constructor(x, y, plosk, numberOfPoints) {
      this.hu = y;
      this.firework = new Point(x, y, this.hu, true);
      this.exploded = false;
      this.particles = [];
      this.plosk = plosk;
      this.numberOfPoints = numberOfPoints;
    }
  
    done() {
      if (this.exploded && this.particles.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  
    update(y) {
      if (!this.exploded) {
        this.firework.applyForce(gravity);
        this.firework.update();
  
        if (this.firework.vel.y >= 0) {
          this.exploded = true;
          this.explode(this.numberOfPoints);
        }
      }
  
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].applyForce(gravity);
        this.particles[i].update();
  
        if (this.particles[i].done()) {
          this.particles.splice(i, 1);
        }
      }
    }
  
    explode(y) {
      let points = y + 10;
      console.log(points)
      // if (this.plosk){
      //   numberOfPoints = 300;
      // } else {
      //   numberOfPoints = 440 - y;
      // }
      for (let i = 0; i < points; i++) {
        const p = new Point(this.firework.pos.x, this.firework.pos.y, this.hu, false);
        this.particles.push(p);
      }
    } 
  
    show() {
      if (!this.exploded) {
        this.firework.show();
      }
  
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].show();
        this.particles[i].floor();
      }
    }
  }