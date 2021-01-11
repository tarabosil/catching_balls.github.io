// Ball constuctor
  function Ball(x, y, w, g, color) {
    this.w = w;   
    this.speed = 0; 
    this.g = g;
    this.color = color * 10;

    this.hue = random(360);
    var options = {
      restitution: 0.5,
      friction: 0,
      density: 1
    }
    this.body = Bodies.circle(x, y, w, options);
    this.body.label = "Ball";
    World.add(world, this.body);

    this.show = function() {
      var pos = this.body.position;
      push();
      translate(pos.x, pos.y);
      colorMode(HSL, 359, 100, 100);
      fill(this.color, 94, 72);
      noStroke();
      ellipse(0, -40, this.w * 2);
      pop();
    }

    // check if ball is at the bottom
    this.done = function() {
        if (this.body.position.y > height + this.w) {
            return true;
        }  else {
            return false;
        }
    }

    this.removeFromWorld = function() {
      World.remove(world, this.body);
    }

    this.bounce = function() {
      this.speed *= -1;
    }

    // get x location of ball
    this.getX = function() {
        return this.body.position.x;
    }

    // get y location of ball
    this.getY = function() {
        return this.body.position.y;
    }

    // get width of ball
    this.getW = function() {
        return this.w;
    }

    // get color
    this.getColor = function() {
      return this.color;
    }
  }


