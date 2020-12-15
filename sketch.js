let system;
var faces;

//Define ball objects
const fireworks = [];
var balls = [];  
var gravity;

var t;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // capture = createCapture(VIDEO);
  // capture.size(windowWidth, windowHeight);
  // capture.hide();
  // background(0);

  gravity = createVector(0, 0.2);

  
}

function draw() {

  background(0); 
  console.log(balls.length);

  if (balls.length < 4) {
    balls.push(new Ball(random(50, width - 100), -50, random(10,50), random(0.01, 0.09)));
  }
  
  for (var i = 0; i < balls.length; i ++ ) {
    balls[i].update();
    balls[i].display();
    if (balls[i].done()) {
      balls.splice(i, 1);
    }

    if (abs(balls[i].getX() - mouseX) < balls[i].getW() && abs(balls[i].getY() - mouseY) < balls[i].getW()) {
      fireworks.push(new Firework(balls[i].getX(), balls[i].getY(), false, balls[i].getW()));
      balls.splice(i, 1);

    }

    for (let j = fireworks.length - 1; j >= 0; j--) {
      fireworks[j].update(320);
      fireworks[j].show();
      
      if (fireworks[j].done()) {
        fireworks.splice(j, 1);
      }
    }

  }

}
