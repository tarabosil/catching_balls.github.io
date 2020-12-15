
  // Ball constuctor
  function Ball(x, y, w, g) {
    this.x = x;  // x location of square 
    this.y = y;  // y location of square 
    this.w = w;  // speed of square 
    this.speed = 0;  // size
    this.g = g;
  
    this.display = function() {
      noStroke();
      fill(255, 255, this.y)
      ellipse(this.x,this.y,this.w,this.w);
    };
  
    this.update = function() {
      // Add speed to location
      this.y = this.y + this.speed; 
  
      // Add gravity to speed
      this.speed = this.speed + g; 
  
    };

    this.done = function() {
        if (this.y > height + this.w) { 
            return true;
        }  else {
            return false;
        }
    }

    this.getX = function() {
        return this.x;
    }

    this.getY = function() {
        return this.y;
    }

    this.getW = function() {
        return this.w;
    }
  }