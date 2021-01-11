var balls = []; 
var fireworks = [];
var headPoints = [];
var posePoints = [];
var handPoints = [];
var gravity;
var bodyColor = '#FFFFFF';

// define Matter.js elements
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine;
var world;

let videoElement = null;
let canvasElement = null;
let canvasCtx = null;
let controlsElement = null;

// define finger coordinates
var fingerLeftCoor = [];
var fingerRightCoor = [];
var fingerCoordinates = {
    indexRightX: null,
    indexRightY: null,
    indexLeftX: null,
    indexLeftY: null,
    middleRightX: null,
    middleRightY: null,
    ringRightX: null,
    ringRightY: null,
    pinkyRightX: null,
    pinkyRightY: null,
    middleLeftX: null,
    middleLeftY: null,
    ringLeftX: null,
    ringLeftY: null,
    pinkyLeftX: null,
    pinkyLeftY: null,
  };

  // define head coordinates
  var headCoor = [];

  // define pose coordinates
  var poseCoordinates = {
      x11: null,
      y11: null,
      x12: null,
      y12: null,
      x13: null,
      y13: null,
      x14: null,
      y14: null
  };

  // define hand coordinates
  var handCoordinates = {
      x0_left: null,
      y0_left: null,
      x0_right: null,
      y0_right: null
  };

  // define leg coordinates
  var legCoordinates = {
      x24: null,
      y24: null,
      x26: null,
      y26: null,
      x28: null,
      y28: null,
      x23: null,
      y23: null,
      x25: null,
      y25: null,
      x27: null,
      y27: null
  };


// load sound
function preload() {
    firework_sound = loadSound('sound/firework-sound.mp3');
}

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }

function setup() {

    let canvas = createCanvas(windowWidth, windowHeight);
    console.log(canvas.size());
    // canvas.class("output_canvas");
    background(0);

    // Our input frames will come from here.
    videoElement = document.getElementsByClassName('input_video')[0];
    canvasElement = document.getElementById('defaultCanvas0');
    console.log(canvasElement);
    console.log(displayWidth, displayHeight)
    console.log(canvasElement.width, canvasElement.height);
    controlsElement = document.getElementsByClassName('control-panel')[0];
    canvasCtx = canvasElement.getContext('2d');

    gravity = createVector(0, 0.2);
    engine = Engine.create();
    world = engine.world;


    function removeElements(landmarks, elements) {
        for (const element of elements) {
            delete landmarks[element];
        }
    }

    function removeLandmarks(results) {
        if (results.poseLandmarks) {
            removeElements(
                results.poseLandmarks,
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]);
        }
    }

    function connect(ctx, connectors) {
        const canvas = ctx.canvas;
        for (const connector of connectors) {
            const from = connector[0];
            const to = connector[1];
            if (from && to) {
                if (from.visibility && to.visibility && (from.visibility < 0.1 || to.visibility < 0.1)) {
                    continue;
                }
                ctx.beginPath();
                ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
                ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
                ctx.stroke();
            }
        }
    }

    function onResults(results) {
        document.body.classList.add('loaded');

        // Remove landmarks
        removeLandmarks(results);

        getAllCoordinates(results, FACEMESH_FACE_OVAL, HAND_CONNECTIONS);

        // canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: bodyColor});
        drawLandmarks(canvasCtx, results.poseLandmarks, {color: bodyColor, fillColor: bodyColor});

        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {color: bodyColor});
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {color: bodyColor});

        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {color: bodyColor});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {color: bodyColor});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {color: bodyColor});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {color: bodyColor});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {color: bodyColor});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {color: bodyColor});

        // Connect elbows to hands.
        canvasCtx.lineWidth = 3;
        if (results.poseLandmarks) {
            if (results.rightHandLandmarks) {
                canvasCtx.strokeStyle = bodyColor;
                connect(canvasCtx, [[results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW], results.rightHandLandmarks[0]]]);
            }
            if (results.leftHandLandmarks) {
                canvasCtx.strokeStyle = bodyColor;
                connect(canvasCtx, [[results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW], results.leftHandLandmarks[0]]]);
            }
        }
        canvasCtx.restore();
    }

    const holistic = new Holistic({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/${file}`;
    }});
    holistic.setOptions({
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    holistic.onResults(onResults);

    // camera
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            translate(width,0); 
            scale(-1.0,1.0);
            background(0);
            await holistic.send({image: videoElement});
            createFirework();
        },
        width: 1280,
        height: 720
    });
    camera.start();

}


function createFirework() {

    Engine.update(engine);

    // define max number of balls
    if (balls.length < 8) {
        addNewBall();
    }

    // add head points
    clearBodyPoints(headPoints);
    addHeadPoints();
    for (var i = 0; i < headPoints.length; i++) {
        headPoints[i].show();
    }

    // add pose points
    clearBodyPoints(posePoints);
    addPosePoints();
    connectElbowWithHand("x14", "y14", "x0_left", "y0_left");
    connectElbowWithHand("x13", "y13", "x0_right", "y0_right");
    connectLegs("x24", "y24", "x26", "y26");
    connectLegs("x28", "y28", "x26", "y26");
    connectLegs("x23", "y23", "x25", "y25");
    connectLegs("x25", "y25", "x27", "y27");
    for (var i = 0; i < posePoints.length; i++) {
        posePoints[i].show();
    }

    // add hand points
    clearBodyPoints(handPoints);
    addHandPoints();
    for (var i = 0; i < handPoints.length; i++) {
        handPoints[i].show();
    }
    
    // update balls
    for (var i = 0; i < balls.length; i ++ ) {
        balls[i].show();

        if (balls[i].done()) {
            balls[i].removeFromWorld();
            balls.splice(i, 1);
        }

        for (let ii = 0; ii < fingerLeftCoor.length; ii++) {
            if (fingerLeftCoor[ii].x != null && fingerLeftCoor[ii].y != null) {
                try {
                    let distance = dist(fingerLeftCoor[ii].x, fingerLeftCoor[ii].y, balls[i].getX(), balls[i].getY());
                    if (distance < 40) {
                        fireworks.push(new Firework(fingerLeftCoor[ii].x, fingerLeftCoor[ii].y, false, balls[i].getW() * 2, balls[i].getColor()));
                        firework_sound.play();
                        bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                        balls.splice(i, 1);
                    }
                } catch {}
            }
        }

        for (let ii = 0; ii < fingerRightCoor.length; ii++) {
            if (fingerRightCoor[ii].x != null && fingerRightCoor[ii].y != null) {
                try{
                    let distance = dist(fingerRightCoor[ii].x, fingerRightCoor[ii].y, balls[i].getX(), balls[i].getY());
                    if (distance < 40) {
                        fireworks.push(new Firework(fingerRightCoor[ii].x, fingerRightCoor[ii].y, false, balls[i].getW() * 2, balls[i].getColor()));
                        firework_sound.play();
                        bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                        balls.splice(i, 1);
                    }
                } catch {}
            }
        }
        updateFirework();
    } 
}

// add new ball to the world
function addNewBall(){
    var ball = new Ball(random(50, width - 100), random(-50, 0), random(10, 70), random(0.1, 1.0), random(5, 30));
    balls.push(ball);
}

// add head points
function addHeadPoints() {
    for (let i = 0; i < headCoor.length; i++) {
        if (headCoor[i].x != null && headCoor[i].y != null){
            headPoints.push(new BodyPoints(headCoor[i].x, headCoor[i].y, 10));
        }
    }
}

// update fireworks
function updateFirework() {
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].show();
        
        if (fireworks[i].done()) {
            fireworks.splice(i, 1);
        }
    }
}

// add pose points to the world
function addPosePoints() {
    if (poseCoordinates.x12 != null && poseCoordinates.y12 != null && poseCoordinates.x11 != null && poseCoordinates.y11 != null ) {
        posePoints.push(new PosePoints(poseCoordinates.x12, poseCoordinates.y12 , 10));
        posePoints.push(new PosePoints(poseCoordinates.x11, poseCoordinates.y11 , 10));
    }
    if (poseCoordinates.x13 != null && poseCoordinates.y13 != null) {
        posePoints.push(new PosePoints(poseCoordinates.x13, poseCoordinates.y13 , 10));
    }
    if (poseCoordinates.x14 != null && poseCoordinates.y14 != null) {
        posePoints.push(new PosePoints(poseCoordinates.x14, poseCoordinates.y14 , 10));
    }

    connectTwoPosePoints("x11", "y11", "x12", "y12");
    connectTwoPosePoints("x14", "y14", "x12", "y12");
    connectTwoPosePoints("x11", "y11", "x13", "y13");
    connectPoseLegPoints("x11", "y11", "x23", "y23");
    connectPoseLegPoints("x12", "y12", "x24", "y24");
}

// connect two pose points with dotted line
function connectTwoPosePoints(x1, y1, x2, y2) {
    if (poseCoordinates[x1] != null && poseCoordinates[y1] != null && poseCoordinates[x2] != null && poseCoordinates[y2] != null) {
        var count = floor(dist(poseCoordinates[x1], poseCoordinates[y1], poseCoordinates[x2], poseCoordinates[y2]) / (10 * 2));
        var dir = createVector((poseCoordinates[x2] - poseCoordinates[x1]) / count, (poseCoordinates[y2] - poseCoordinates[y1]) / count);
        for (var i = 0; i < count; i++){
            posePoints.push(new PosePoints(poseCoordinates[x1] + dir.x * i, poseCoordinates[y1] + dir.y * i , 5));
        }
    }
}

// connect one pose point with one leg point
function connectPoseLegPoints(x1, y1, x2, y2) {
    if (poseCoordinates[x1] != null && poseCoordinates[y1] != null && legCoordinates[x2] != null && legCoordinates[y2] != null) {
        var count = floor(dist(poseCoordinates[x1], poseCoordinates[y1], legCoordinates[x2], legCoordinates[y2]) / (10 * 2));
        var dir = createVector((legCoordinates[x2] - poseCoordinates[x1]) / count, (legCoordinates[y2] - poseCoordinates[y1]) / count);
        for (var i = 0; i < count; i++){
            posePoints.push(new PosePoints(poseCoordinates[x1] + dir.x * i, poseCoordinates[y1] + dir.y * i , 5));
        }
    }
}

// clear body points (hand, head, pose)
function clearBodyPoints(points) {
    for (var i = 0; i < points.length; i++) {
        points[i].removeFromWorld();
        points.splice(i, 1);
    }
}

// add hand points to the world
function addHandPoints() {
    if (handCoordinates.x0_left != null && handCoordinates.y0_left != null) {
        handPoints.push(new HandPoints(handCoordinates.x0_left, handCoordinates.y0_left , 10));
    }
    if (handCoordinates.x0_right != null && handCoordinates.y0_right != null) {
        handPoints.push(new HandPoints(handCoordinates.x0_right, handCoordinates.y0_right , 10));
    }
}

// connect elbow with wrist on hand
function connectElbowWithHand(x1, y1, x2, y2) {
    if (poseCoordinates[x1] != null && poseCoordinates[y1] != null && handCoordinates[x2] != null && handCoordinates[y2] != null) {
        var count = floor(dist(poseCoordinates[x1], poseCoordinates[y1], handCoordinates[x2], handCoordinates[y2]) / (10 * 2));
        var dir = createVector((handCoordinates[x2] - poseCoordinates[x1]) / count, (handCoordinates[y2] - poseCoordinates[y1]) / count);
        for (var i = 0; i < count; i++){
            posePoints.push(new PosePoints(poseCoordinates[x1] + dir.x * i, poseCoordinates[y1] + dir.y * i , 5));
        }
    }
}

// connect two leg points together 
function connectLegs(x1, y1, x2, y2) {
    if (legCoordinates[x1] != null && legCoordinates[y1] != null && legCoordinates[x2] != null && legCoordinates[y2] != null) {
        var count = floor(dist(legCoordinates[x1], legCoordinates[y1], legCoordinates[x2], legCoordinates[y2]) / (10 * 2));
        var dir = createVector((legCoordinates[x2] - legCoordinates[x1]) / count, (legCoordinates[y2] - legCoordinates[y1]) / count);
        for (var i = 0; i < count; i++){
            posePoints.push(new PosePoints(legCoordinates[x1] + dir.x * i, legCoordinates[y1] + dir.y * i , 5));
        }
    }
}

// ocnvert hsl color to hex 
function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }


  function getAllCoordinates(results, FACEMESH_FACE_OVAL, HAND_CONNECTIONS) {
      // head coordinates
      for (let i = 0; i < FACEMESH_FACE_OVAL.length; i++) {
        headCoor[i] = {};
        try {
            headCoor[i].x = results.faceLandmarks[FACEMESH_FACE_OVAL[i][0]].x * width;
            headCoor[i].y= results.faceLandmarks[FACEMESH_FACE_OVAL[i][0]].y * height;
        } catch {
            headCoor[i].x = null;
            headCoor[i].y = null;
        }
    }

    // left fingers coordinates
    let j = 0;
    for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
        if (HAND_CONNECTIONS[i][1] % 4 == 0){
            fingerLeftCoor[j] = {};
            try {
                fingerLeftCoor[j].x = results.leftHandLandmarks[HAND_CONNECTIONS[i][1]].x * width;
                fingerLeftCoor[j].y = results.leftHandLandmarks[HAND_CONNECTIONS[i][1]].y * height;
            } catch {
                fingerLeftCoor[j].x = null;
                fingerLeftCoor[j].y = null;
            }
            j += 1;
        }
    }

    // right fingers coordinates
    let k = 0;
    for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
        if (HAND_CONNECTIONS[i][1] % 4 == 0){
            fingerRightCoor[k] = {};
            try {
                fingerRightCoor[k].x = results.rightHandLandmarks[HAND_CONNECTIONS[i][1]].x * width;
                fingerRightCoor[k].y = results.rightHandLandmarks[HAND_CONNECTIONS[i][1]].y * height;
            } catch {
                fingerRightCoor[k].x = null;
                fingerRightCoor[k].y = null;
            }
            k += 1;
        }
    }

    // get pose coordinates
    try {
        poseCoordinates.x11 = results.poseLandmarks[11].x * width;
        poseCoordinates.y11 = results.poseLandmarks[11].y * height;
        poseCoordinates.x12 = results.poseLandmarks[12].x * width;
        poseCoordinates.y12 = results.poseLandmarks[12].y * height;
        poseCoordinates.x13 = results.poseLandmarks[13].x * width;
        poseCoordinates.y13 = results.poseLandmarks[13].y * height;
        poseCoordinates.x14 = results.poseLandmarks[14].x * width;
        poseCoordinates.y14 = results.poseLandmarks[14].y * height;
    } catch {
        poseCoordinates.x11 = null;
        poseCoordinates.y11 = null;
        poseCoordinates.x12 = null;
        poseCoordinates.y12 = null;
        poseCoordinates.x13 = null;
        poseCoordinates.y13 = null;
        poseCoordinates.x14 = null;
        poseCoordinates.y14 = null;
    }

    // get left wrist coordinates
    try {
        handCoordinates.x0_left = results.leftHandLandmarks[0].x * width;
        handCoordinates.y0_left = results.leftHandLandmarks[0].y * height;
    } catch {
        handCoordinates.x0_left = null;
        handCoordinates.y0_left = null;
    }

    // get right wrist coordinates
    try {
        handCoordinates.x0_right = results.rightHandLandmarks[0].x * width;
        handCoordinates.y0_right = results.rightHandLandmarks[0].y * height;
    } catch {
        handCoordinates.x0_right = null;
        handCoordinates.y0_right = null;
    }

    try {
        legCoordinates.x23 = results.poseLandmarks[23].x * width;
        legCoordinates.y23 = results.poseLandmarks[23].y * height;
        legCoordinates.x24 = results.poseLandmarks[24].x * width;
        legCoordinates.y24 = results.poseLandmarks[24].y * height;
    } catch {
        legCoordinates.x23 = null;
        legCoordinates.y23 = null;
        legCoordinates.x24 = null;
        legCoordinates.y24 = null;
    }

    try {
        legCoordinates.x25 = results.poseLandmarks[25].x * width;
        legCoordinates.y25 = results.poseLandmarks[25].y * height;
        legCoordinates.x26 = results.poseLandmarks[26].x * width;
        legCoordinates.y26 = results.poseLandmarks[26].y * height;
    } catch {
        legCoordinates.x25 = null;
        legCoordinates.y25 = null;
        legCoordinates.x26 = null;
        legCoordinates.y26 = null;
    }

    try {
        legCoordinates.x27 = results.poseLandmarks[27].x * width;
        legCoordinates.y27 = results.poseLandmarks[27].y * height;
        legCoordinates.x28 = results.poseLandmarks[28].x * width;
        legCoordinates.y28 = results.poseLandmarks[28].y * height;
    } catch {
        legCoordinates.x27 = null;
        legCoordinates.y27 = null;
        legCoordinates.x28 = null;
        legCoordinates.y28 = null;
    }
  }