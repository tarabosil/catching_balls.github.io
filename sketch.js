let system;
var faces;

const fireworks = [];
let gravity;

let pg;

// texture for the particle
let particle_texture = null;

// variable holding our particle system
let ps = null;

function preload() {
  particle_texture = loadImage("assets/particle_texture.png");
}

var t;

function setup() {
  createCanvas(600, 440);
  capture = createCapture(VIDEO);
  capture.size(600, 440);
  capture.hide();
  gravity = createVector(0, 0.2);
  background(0);

  // pixelDensity(1);
  // pg = createGraphics(600, 440);

  ps = new SmokingSystem(0, createVector(width / 2, height / 2), particle_texture);
  t = 0;

}

function draw() {
  // console.log(mouseX, mouseY);
  // background(220);
  background(0, 10);
  // image(capture, 0, 0, 600, 440);
  // image(pg, 0, 0, 600, 440);
  let speed = abs(winMouseX - pwinMouseX);
 
  // if (random(1) < 0.03) {
  //   fireworks.push(new Firework());
  // }
  
  // for (let i = fireworks.length - 1; i >= 0; i--) {
  //   fireworks[i].update();
  //   fireworks[i].show();
    
  //   if (fireworks[i].done()) {
  //     fireworks.splice(i, 1);
  //   }
  // }

  // let dx = map(mouseX, 0, width, -0.2, 0.2);
  // let wind = createVector(dx, 0);

  // ps.applyForce(wind);
  // ps.run();
  // for (let i = 0; i < 3; i++) {
  //   ps.addParticle(createVector(mouseX, mouseY));
  // }

  // var x = width * noise(t);
  // var y = height * noise(t+5);
  var r = 255 * noise(t+10);
  var g = 255 * noise(t+15);
  var b = 255 * noise(t+20);
  
  noStroke();
  fill(r, g, b);
  ellipse(mouseX, mouseY, 20, 20);

  t = t + 0.01;


  // stroke(10); 
  // pg.line(mouseX, mouseY, pmouseX, pmouseY);
}
