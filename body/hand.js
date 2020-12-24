function HandPoints(x, y, r) {
    var options = {
      restitution: 1,
      friction: 0,
      isStatic: true
    }
    this.body = Bodies.circle(x, y, r, options);
    this.body.label = "Hand Point";
    this.r = r;
    World.add(world, this.body);
  }
  
  HandPoints.prototype.show = function() {
    noStroke();
    fill(0, 0, 0, 0);
    var pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    ellipse(0, 0, this.r * 2);
    pop();
  }
  
  HandPoints.prototype.removeFromWorld = function() {
      World.remove(world, this.body);
  }