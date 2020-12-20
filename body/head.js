function BodyPoints(x, y, r) {
    var options = {
      restitution: 1,
      friction: 0,
      isStatic: true
    }
    this.body = Bodies.circle(x, y, r, options);
    this.body.label = "Head Point";
    this.r = r;
    World.add(world, this.body);
  }
  
  BodyPoints.prototype.show = function() {
    noStroke();
    fill(0);
    var pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    ellipse(0, 0, this.r * 2);
    pop();
  }

  BodyPoints.prototype.removeFromWorld = function() {
      World.remove(world, this.body);
  }