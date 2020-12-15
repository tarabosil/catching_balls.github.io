let w = 640;
let h = 480;
let video;
let poseNet;
let poses = [];
let skeletons = [];
let textures = [];
let pPositions = [];
let cPositions = [];
let xs = [];
let easing = 0.1;

// physics for playful interaction
let VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
    VerletParticle2D = toxi.physics2d.VerletParticle2D,
    AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior,
    GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
    Vec2D = toxi.geom.Vec2D,
    Rect = toxi.geom.Rect;

let physics;
let mouseAttractor;
let mousePos;

let headAttractor;
let headPos;

let leftSAttractor;
let leftPos;

let rightSAttractor;
let rightPos;

let leftHAttractor;
let leftHPos;

let rightHAttractor;
let rightHPos;

const fireworks = [];
let gravity;

let handX;
let handY;

let pHandX;
let pHandY;

var balls = [];  


function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  background(0);

  gravity = createVector(0, 0.2);

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', function (results) {
    poses = results;
  });

  
  video.hide();
  fill(255);
  stroke(255);

  physics = new VerletPhysics2D();
  physics.setDrag(0.05);
  physics.setWorldBounds(new Rect(50, 0, width-100, height-height/3));
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.15)));

  headPos = new Vec2D(width/2,height/2); 
  headAttractor = new AttractionBehavior(headPos, 200, -2.9);
  physics.addBehavior(headAttractor);

  leftPos = new Vec2D(width/2,height/2); 
  leftSAttractor = new AttractionBehavior(leftPos, 100, -2.9);
  physics.addBehavior(leftSAttractor);
  
  rightPos = new Vec2D(width/2,height/2); 
  rightSAttractor = new AttractionBehavior(rightPos, 100, -2.9);
  physics.addBehavior(rightSAttractor);

  leftHPos = new Vec2D(width/2,height/2); 
  leftHAttractor = new AttractionBehavior(leftHPos, 100, -2.9);
  physics.addBehavior(leftHAttractor);

  rightHPos = new Vec2D(width/2,height/2); 
  rightHAttractor = new AttractionBehavior(rightHPos, 100, -2.9);
  physics.addBehavior(rightHAttractor);

  t = 0;
}


function draw() {
  physics.update();
  background(0);
  // tint(0,40);
  // image(video, 0, 0, w, h);
  var coordinates;
  coordinates = drawKeypoints();

  // if (balls.length < 4) {
  //   balls.push(new Ball(random(50, width - 100), -50, random(10,50), random(0.01, 0.09)));
  // }
  
  // for (var i = 0; i < balls.length; i ++ ) {
  //   balls[i].update();
  //   balls[i].display();
  //   if (balls[i].done()) {
  //     balls.splice(i, 1);
  //   }

  //   if (abs(balls[i].getX() - mouseX) < balls[i].getW() && abs(balls[i].getY() - mouseY) < balls[i].getW()) {
  //     fireworks.push(new Firework(balls[i].getX(), balls[i].getY(), false, balls[i].getW()));
  //     balls.splice(i, 1);

  //   }

  //   for (let j = fireworks.length - 1; j >= 0; j--) {
  //     fireworks[j].update(320);
  //     fireworks[j].show();
      
  //     if (fireworks[j].done()) {
  //       fireworks.splice(j, 1);
  //     }
  //   }

  // }
  

  stroke(0,100);
    
  for (let i=0;i<physics.particles.length;i++) {
    let p = physics.particles[i];
    cPositions[i]=createVector(p.x,p.y);
    fill(255);
    noStroke();
    ellipse(p.x, p.y, 8, 8);

    var angleDeg = Math.atan2(pPositions[i].y - p.y, pPositions[i].x - p.x);
    let targetX = angleDeg;
    let dx = targetX - xs[i];
    xs[i] += dx * easing;
  
    tint(255);
    push();
    translate(p.x, p.y);
    rotate(xs[i]);
    pop();
    pPositions[i] = cPositions[i];
  }
  noStroke();

  // check for left and right wrist and draw fireworks
  if (coordinates.xRight != null && coordinates.yRight != null && coordinates.xLeft != null && coordinates.yLeft != null) {
    let distX = dist(coordinates.xRight, coordinates.yRight, coordinates.xLeft, coordinates.yLeft);
    if (distX < 80) {
      background(0,0,35,25);
      coordinates = drawKeypoints();
      drawSkeleton();
      console.log("PLoooooooooosk");
      // fireworks.push(new Firework(coordinates.xRight, coordinates.yRight, true));
      var galaxy = { 
        locationX : random(width),
        locationY : random(height),
        size : random(1, 4)
      }
        ellipse(mouseX ,mouseY, galaxy.size, galaxy.size);
        ellipse(galaxy.locationX ,galaxy.locationY, galaxy.size, galaxy.size);
    
    } else {
      background(0);
      coordinates = drawKeypoints();
      drawSkeleton();
      if (coordinates.xLeft != null && coordinates.yLeft != null) {
        if (random(1) < 0.03) {
          fireworks.push(new Firework(coordinates.xLeft, coordinates.yLeft, false, 100));
        }
        for (let i = fireworks.length - 1; i >= 0; i--) {
          fireworks[i].update(coordinates.yRight);
          fireworks[i].show();
          
          if (fireworks[i].done()) {
            fireworks.splice(i, 1);
          }
        }
      }
    
      if (coordinates.xRight != null && coordinates.yRight != null) {
        if (random(1) < 0.03) {
          fireworks.push(new Firework(coordinates.xRight, coordinates.yRight, false, 100));
        }
        for (let i = fireworks.length - 1; i >= 0; i--) {
          fireworks[i].update(coordinates.yRight);
          fireworks[i].show();
    
          if (fireworks[i].done()) {
            fireworks.splice(i, 1);
          }
        }
      }
    }
  }

  // update fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update(coordinates.yRight);
    fireworks[i].show();

    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

// draw skeleton
function drawSkeleton() {
  for(let i = 0; i < poses.length; i++) {
    for(let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255);
      if ((partA.part == "leftShoulder" && partB.part == "leftHip") || (partB.part == "leftShoulder" && partA.part == "leftHip") ||
      (partA.part == "rightShoulder" && partB.part == "rightHip") || (partA.part == "rightHip" && partB.part == "rightShoulder")) {
      } else {
        line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
      }
    }
    break;
  }
}

// draw keypoints for skeleton
function drawKeypoints() {

  let headX, headY;

  var coordinates = {
    xLeft: null,
    xRight: null,
    yLeft: null,
    yRight: null
  };

  for(let i = 0; i < poses.length; i++) {
    for(let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        // draw keypoints for skeleton
        if (j != 1 && j != 2 && j != 3 && j != 4 && j != 0) {
          fill(255);
          noStroke();
          ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
        if (j == 9) {
          coordinates.xLeft = keypoint.position.x;
          coordinates.yLeft = keypoint.position.y;
        }
        if (j == 10) {
          coordinates.xRight = keypoint.position.x;
          coordinates.yRight = keypoint.position.y;
        }
        // draw head
        if(j==0) {
          headPos.set(keypoint.position.x, keypoint.position.y);
          noFill();
          let head = poses[i].pose.keypoints[3].position.x - poses[i].pose.keypoints[4].position.x;
          stroke(255);
          ellipse(keypoint.position.x, keypoint.position.y, head, head);
          fill(255);
          noStroke();
          headX = keypoint.position.x;
          headY = keypoint.position.y + (head / 2);
          ellipse(headX, headY, 10, 10);
        }
      }
    }
    // find middle points for middle line of skeleton
    let middleX1, middleY1, middleX2, middleY2;
    if (poses[i].pose.keypoints[5] != null && poses[i].pose.keypoints[6] != null) {
      if (poses[i].pose.keypoints[5].score > 0.2 && poses[i].pose.keypoints[6].score > 0.2) {
        middleX1 = (poses[i].pose.keypoints[5].position.x + poses[i].pose.keypoints[6].position.x) / 2;
        middleY1 = (poses[i].pose.keypoints[5].position.y + poses[i].pose.keypoints[6].position.y) / 2;
        fill(255);
        noStroke();
        ellipse(middleX1, middleY1, 10, 10);
      }
    }
    if (poses[i].pose.keypoints[11] != null && poses[i].pose.keypoints[12] != null) {
      if (poses[i].pose.keypoints[11].score > 0.2 && poses[i].pose.keypoints[12].score > 0.2) {
        middleX2 = (poses[i].pose.keypoints[11].position.x + poses[i].pose.keypoints[12].position.x) / 2;
        middleY2 = (poses[i].pose.keypoints[11].position.y + poses[i].pose.keypoints[12].position.y) / 2;
        fill(255);
        noStroke();
        ellipse(middleX2, middleY2, 10, 10);
      }
    }
    if (poses[i].pose.keypoints[11] != null && poses[i].pose.keypoints[12] != null && poses[i].pose.keypoints[5] != null && poses[i].pose.keypoints[6] != null) {
      if (poses[i].pose.keypoints[11].score > 0.2 && poses[i].pose.keypoints[12].score > 0.2 && poses[i].pose.keypoints[5].score > 0.2 && poses[i].pose.keypoints[6].score > 0.2) {
        stroke(255);
        line(middleX1, middleY1, middleX2, middleY2);
        line(middleX1, middleY1, headX, headY);
      }
    }
    if (poses[i].pose.keypoints[5] != null && poses[i].pose.keypoints[6] != null) {
      if (poses[i].pose.keypoints[5].score > 0.2 && poses[i].pose.keypoints[6].score > 0.2) {
        stroke(255);
        line(middleX1, middleY1, headX, headY);
      }
    }
    break;
  }
  return coordinates;
}

function modelLoaded() {
  print('model loaded'); 
}

