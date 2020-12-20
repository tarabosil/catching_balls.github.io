// function PosePoints(x, y, w, h, vertices) {
//     var options = {
//       restitution: 1,
//       friction: 0,
//       isStatic: true
//     }
//     this.body = Bodies.rectangle(x, y, w, h, options);
//     this.body.label = "Pose Point";
//     this.w = w;
//     this.h = h;
//     World.add(world, this.body);
//   }
  
//   PosePoints.prototype.show = function() {
//     noStroke();
//     fill(0);
//     var pos = this.body.position;
//     push();
//     translate(pos.x, pos.y);
//     rect(0, 0, this.w, this.h);
//     pop();
//   }

//   PosePoints.prototype.removeFromWorld = function() {
//       World.remove(world, this.body);
//   }

function PosePoints(x, y, r) {
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

PosePoints.prototype.show = function() {
  noStroke();
  fill(0);
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  ellipse(0, 0, this.r * 2);
  pop();
}

PosePoints.prototype.removeFromWorld = function() {
    World.remove(world, this.body);
}