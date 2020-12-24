/*
MediaPipe library for body detection
*/

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

// define index finger coordinates
var coordinates = {
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
  var headCoordinates = {
      x0: null,
      y0: null,
      x1: null,
      y1: null,
      x2: null,
      y2: null,
      x3: null,
      y4: null,
      x5: null,
      y5: null,
      x6: null,
      y6: null,
      x54: null,
      y54: null,
      x284: null,
      y284: null,
      x21: null,
      y21: null,
      x251: null,
      y251: null,
      x162: null,
      y162: null,
      x389: null,
      y389: null,
      x127: null,
      y127: null,
      x356: null,
      y356: null
  };

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

  var handCoordinates = {
      x0_left: null,
      y0_left: null,
      x0_right: null,
      y0_right: null
  };

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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {

    let canvas = createCanvas(windowWidth, windowHeight);
    console.log(windowWidth, windowHeight);
    canvas.class("output_canvas");
    background(0);

    gravity = createVector(0, 0.2);
    engine = Engine.create();
    world = engine.world;

    // Our input frames will come from here.
    videoElement = document.getElementsByClassName('input_video')[0];
    canvasElement = document.getElementsByClassName('output_canvas')[0];
    canvasElement.width  = window.innerWidth;
    canvasElement.height = window.innerHeight;
    controlsElement = document.getElementsByClassName('control-panel')[0];
    canvasCtx = canvasElement.getContext('2d');


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
        // Hide the spinner.
        document.body.classList.add('loaded');

        // Remove landmarks we don't want to draw.
        removeLandmarks(results);

        try {
            coordinates.indexLeftX = results.leftHandLandmarks[8].x * width;
            coordinates.indexLeftY = results.leftHandLandmarks[8].y * height;
            coordinates.middleLeftX = results.leftHandLandmarks[12].x * width;
            coordinates.middleLeftY = results.leftHandLandmarks[12].y * height;
            coordinates.ringLeftX = results.leftHandLandmarks[16].x * width;
            coordinates.ringLeftY = results.leftHandLandmarks[16].y * height;
            coordinates.pinkyLeftX = results.leftHandLandmarks[20].x * width;
            coordinates.pinkyLeftY = results.leftHandLandmarks[20].y * height;
        } catch {
            coordinates.indexLeftX = null;
            coordinates.indexLeftY = null;
            coordinates.middleLeftX = null;
            coordinates.middleLeftY = null;
            coordinates.ringLeftX = null;
            coordinates.ringLeftY = null;
            coordinates.pinkyLeftX = null;
            coordinates.pinkyLeftY = null;
        }

        try {
            coordinates.indexRightX = results.rightHandLandmarks[8].x * width;
            coordinates.indexRightY = results.rightHandLandmarks[8].y * height;
            coordinates.middleRightX = results.rightHandLandmarks[12].x * width;
            coordinates.middleRightY = results.rightHandLandmarks[12].y * height;
            coordinates.ringRightX = results.rightHandLandmarks[16].x * width;
            coordinates.ringRightY = results.rightHandLandmarks[16].y * height;
            coordinates.pinkyRightX = results.rightHandLandmarks[20].x * width;
            coordinates.pinkyRightY = results.rightHandLandmarks[20].y * height;
        } catch {
            coordinates.indexRightX = null;
            coordinates.indexRightY = null;
            coordinates.middleRightX = null;
            coordinates.middleRightY = null;
            coordinates.ringRightX = null;
            coordinates.ringRightY = null;
            coordinates.pinkyRightX = null;
            coordinates.pinkyRightY = null;
        }

        // get head coordinates
        try {
            headCoordinates.x0 = results.faceLandmarks[10].x * width;
            headCoordinates.y0 = results.faceLandmarks[10].y * height;
            headCoordinates.x1 = results.faceLandmarks[109].x * width;
            headCoordinates.y1 = results.faceLandmarks[109].y * height;
            headCoordinates.x2 = results.faceLandmarks[338].x * width;
            headCoordinates.y2 = results.faceLandmarks[338].y * height;
            headCoordinates.x3 = results.faceLandmarks[67].x * width;
            headCoordinates.y3 = results.faceLandmarks[67].y * height;
            headCoordinates.x4 = results.faceLandmarks[103].x * width;
            headCoordinates.y4 = results.faceLandmarks[103].y * height;
            headCoordinates.x5 = results.faceLandmarks[297].x * width;
            headCoordinates.y5 = results.faceLandmarks[297].y * height;
            headCoordinates.x6 = results.faceLandmarks[332].x * width;
            headCoordinates.y6 = results.faceLandmarks[332].y * height;
            headCoordinates.x54 = results.faceLandmarks[54].x * width;
            headCoordinates.y54 = results.faceLandmarks[54].y * height;
            headCoordinates.x284 = results.faceLandmarks[284].x * width;
            headCoordinates.y284 = results.faceLandmarks[284].y * height;
            headCoordinates.x21 = results.faceLandmarks[21].x * width;
            headCoordinates.y21  = results.faceLandmarks[21].y * height;
            headCoordinates.x251 = results.faceLandmarks[251].x * width;
            headCoordinates.y251 = results.faceLandmarks[251].y * height;
            headCoordinates.x162 = results.faceLandmarks[162].x * width;
            headCoordinates.y162= results.faceLandmarks[162].y * height;
            headCoordinates.x389 = results.faceLandmarks[389].x * width;
            headCoordinates.y389 = results.faceLandmarks[389].y * height;
            headCoordinates.x127 = results.faceLandmarks[127].x * width;
            headCoordinates.y127 = results.faceLandmarks[127].y * height;
            headCoordinates.x356 = results.faceLandmarks[356].x * width;
            headCoordinates.y356 = results.faceLandmarks[356].y * height;
        } catch {
            headCoordinates.x0 = null;
            headCoordinates.y0 = null;
            headCoordinates.x1 = null;
            headCoordinates.y1 = null;
            headCoordinates.x2 = null;
            headCoordinates.y2 = null;
            headCoordinates.x3 = null;
            headCoordinates.y3 = null;
            headCoordinates.x4 = null;
            headCoordinates.y4 = null;
            headCoordinates.x5 = null;
            headCoordinates.y5 = null;
            headCoordinates.x6 = null;
            headCoordinates.y6 = null;
            headCoordinates.x54 = null;
            headCoordinates.y54 = null;
            headCoordinates.x284 = null;
            headCoordinates.y284 = null;
            headCoordinates.x21 = null;
            headCoordinates.y21  = null;
            headCoordinates.x251 = null;
            headCoordinates.y251 = null;
            headCoordinates.x162 = null;
            headCoordinates.y162= null;
            headCoordinates.x389 = null;
            headCoordinates.y389 = null;
            headCoordinates.x127 = null;
            headCoordinates.y127 = null;
            headCoordinates.x356 = null;
            headCoordinates.y356 = null;
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

        // Draw the overlays.
        // canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        // Pose...
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: bodyColor});
        drawLandmarks(canvasCtx, results.poseLandmarks, {color: bodyColor, fillColor: bodyColor});

        // Hands...
        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {color: bodyColor});
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {color: bodyColor});

        // Face...
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
                connect(canvasCtx, [[
                            results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
                            results.rightHandLandmarks[0]
                        ]]);
            }
            if (results.leftHandLandmarks) {
                canvasCtx.strokeStyle = bodyColor;
                connect(canvasCtx, [[
                        results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
                        results.leftHandLandmarks[0]
                        ]]);
            }
        }

        canvasCtx.restore();
    }

    const holistic = new Holistic({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/${file}`;
    }});
    holistic.onResults(onResults);

    /**
    * Instantiate a camera. We'll feed each frame we receive into the solution.
    */
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            translate(width,0); 
            scale(-1.0,1.0);
            background(0);
            // canvasManipulation();
            await holistic.send({image: videoElement});
            drawBalls();
        },
        width: 1280,
        height: 720
    });
    camera.start();

}

function canvasManipulation() {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

function drawImage() {
    canvasCtx.drawImage(
		res.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );
}

function drawBalls() {

    Engine.update(engine);

    if (balls.length < 4) {
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
    
    for (var i = 0; i < balls.length; i ++ ) {
        balls[i].show();

        if (balls[i].done()) {
            balls[i].removeFromWorld();
            balls.splice(i, 1);
        }

        // right hand check - explode the ball
        if (coordinates.indexRightX != null && coordinates.indexRightY != null) {
            try {
                let distRight = dist(coordinates.indexRightX, coordinates.indexRightY, balls[i].getX(), balls[i].getY());
                let distRight1 = dist(coordinates.middleRightX, coordinates.middleRightY, balls[i].getX(), balls[i].getY());
                let distRight2 = dist(coordinates.ringRightX, coordinates.ringRightY, balls[i].getX(), balls[i].getY());
                let distRight3 = dist(coordinates.pinkyRightX, coordinates.pinkyRightY, balls[i].getX(), balls[i].getY());
                if (distRight < 40) {
                    fireworks.push(new Firework(coordinates.indexRightX, coordinates.indexRightY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
                if (distRight1 < 40) {
                    fireworks.push(new Firework(coordinates.middleRightX, coordinates.middleRightY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
                if (distRight2 < 40) {
                    fireworks.push(new Firework(coordinates.ringRightX, coordinates.ringRightY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
                if (distRight3 < 40) {
                    fireworks.push(new Firework(coordinates.pinkyRightX, coordinates.pinkyRightY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
            } catch {}
        }

        // left hand check - explode the ball
        if (coordinates.indexLeftX != null && coordinates.indexLeftY != null) {
            try {
                let distRight = dist(coordinates.indexLeftX, coordinates.indexLeftY, balls[i].getX(), balls[i].getY());
                let distRight1 = dist(coordinates.middleLeftX, coordinates.middleLeftY, balls[i].getX(), balls[i].getY());
                let distRight2 = dist(coordinates.ringLeftX, coordinates.ringLeftY, balls[i].getX(), balls[i].getY());
                let distRight3 = dist(coordinates.pinkyLeftX, coordinates.pinkyLeftY, balls[i].getX(), balls[i].getY());
                if (distRight < 40) {
                    fireworks.push(new Firework(coordinates.indexLeftX, coordinates.indexLeftY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
                if (distRight1 < 40) {
                    fireworks.push(new Firework(coordinates.middleLeftX, coordinates.middleLeftY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
                if (distRight2 < 40) {
                    fireworks.push(new Firework(coordinates.ringLeftX, coordinates.ringLeftY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
                if (distRight3 < 40) {
                    fireworks.push(new Firework(coordinates.pinkyLeftX, coordinates.pinkyLeftY, false, balls[i].getW() * 2, balls[i].getColor()));
                    firework_sound.play();
                    bodyColor = hslToHex(balls[i].getColor(), 94, 72);
                    balls.splice(i, 1);
                }
            } catch {}
        }
        updateFirework();
    } 
}

// add new ball to the world
function addNewBall(){
    var ball = new Ball(random(50, width - 100), 0, random(20, 70), random(0.1, 1.0), random(5, 30));
    balls.push(ball);
}

// add head points
function addHeadPoints() {
    if (headCoordinates.x0 != null && headCoordinates.y0 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x0, headCoordinates.y0, 10));
    }
    if (headCoordinates.x1 != null && headCoordinates.y1 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x1, headCoordinates.y1, 10));
    }
    if (headCoordinates.x2 != null && headCoordinates.y2 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x2, headCoordinates.y2, 10));
    }
    if (headCoordinates.x3 != null && headCoordinates.y3 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x3, headCoordinates.y3, 10));
    }
    if (headCoordinates.x4 != null && headCoordinates.y4 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x4, headCoordinates.y4, 10));
    }
    if (headCoordinates.x5 != null && headCoordinates.y5 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x5, headCoordinates.y5, 10));
    }
    if (headCoordinates.x6 != null && headCoordinates.y6 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x6, headCoordinates.y6, 10));
    }
    if (headCoordinates.x54 != null && headCoordinates.y54!= null) {
        headPoints.push(new BodyPoints(headCoordinates.x54, headCoordinates.y54, 10));
    }
    if (headCoordinates.x284 != null && headCoordinates.y284 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x284, headCoordinates.y284, 10));
    }
    if (headCoordinates.x21 != null && headCoordinates.y21 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x21, headCoordinates.y21, 10));
    }
    if (headCoordinates.x162 != null && headCoordinates.y162 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x162, headCoordinates.y162, 10));
    }
    if (headCoordinates.x251 != null && headCoordinates.y251 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x251, headCoordinates.y251, 10));
    }
    if (headCoordinates.x389 != null && headCoordinates.y389 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x389, headCoordinates.y389, 10));
    }
    if (headCoordinates.x127 != null && headCoordinates.y127 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x127, headCoordinates.y127, 10));
    }
    if (headCoordinates.x356 != null && headCoordinates.y356 != null) {
        headPoints.push(new BodyPoints(headCoordinates.x356, headCoordinates.y356, 10));
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

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
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