var balls = []; 
const fireworks = [];
var gravity;


let videoElement = null;
let canvasElement = null;
let canvasCtx = null;
let controlsElement = null;

var coordinates = {
    indexRightX: null,
    indexRightY: null
  };


function setup() {

    let canvas = createCanvas(780, 400);
    canvas.class("output_canvas");

    gravity = createVector(0, 0.2);

    // Our input frames will come from here.
    videoElement = document.getElementsByClassName('input_video')[0];
    
    canvasElement = document.getElementsByClassName('output_canvas')[0];
    controlsElement = document.getElementsByClassName('control-panel')[0];
    canvasCtx = canvasElement.getContext('2d');


    // We'll add this to our control panel later, but we'll save it here so we can
    // call tick() each time the graph runs.
    const fpsControl = new FPS();

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
                if (from.visibility && to.visibility &&
                    (from.visibility < 0.1 || to.visibility < 0.1)) {
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
        // console.log(results);

        try {
            coordinates.indexLeftX = results["leftHandLandmarks"][8].x * width;
            coordinates.indexLeftY = results["leftHandLandmarks"][8].y * height;
        } catch {
        }

        try {
            coordinates.indexRightX = results["rightHandLandmarks"][8].x * width;
            coordinates.indexRightY = results["rightHandLandmarks"][8].y * height;
        } catch {}

        // console.log(coordinates);

        // Draw the overlays.
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, 780, 400);
        canvasCtx.drawImage(results.image, 0, 0, 780, 400);
        // Pose...
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00'});
        drawLandmarks( canvasCtx, results.poseLandmarks, {color: '#00FF00', fillColor: '#FF0000'});

        // Hands...
        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {color: '#00CC00'});
        drawLandmarks(canvasCtx, results.rightHandLandmarks, {color: '#00FF00', fillColor: '#FF0000'});
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {color: '#CC0000'});
        drawLandmarks(canvasCtx, results.leftHandLandmarks, {color: '#FF0000', fillColor: '#00FF00'});

        // Face...
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
        drawConnectors( canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {color: '#E0E0E0'});

        // Connect elbows to hands.
        canvasCtx.lineWidth = 5;
        if (results.poseLandmarks) {
            if (results.rightHandLandmarks) {
            canvasCtx.strokeStyle = '#00FF00';
            connect(canvasCtx, [[
                        results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
                        results.rightHandLandmarks[0]
                    ]]);
            }
            if (results.leftHandLandmarks) {
                canvasCtx.strokeStyle = '#FF0000';
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
            translate(width,0); // move to far corner
            scale(-1.0,1.0);
            canvasManipulation();
            await holistic.send({image: videoElement});
            drawBalls();
        },
        width: 1280,
        height: 720
    });
    camera.start();

}

// function draw() {
//     drawBalls();
// }

function canvasManipulation() {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, 780, 400);
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

    if (balls.length < 4) {
        balls.push(new Ball(random(50, width - 100), -50, random(20,70), random(1.0, 3.0)));
    }

    for (var i = 0; i < balls.length; i ++ ) {
        balls[i].update();
        balls[i].display();
        if (balls[i].done()) {
            balls.splice(i, 1);
        }

        if (coordinates.indexRightX != null && coordinates.indexRightY != null) {
            let distRight = dist(coordinates.indexRightX, coordinates.indexRightY, balls[i].getX(), balls[i].getY());
            // console.log(coordinates.indexRightX, coordinates.indexRightY, balls[i].getX(), balls[i].getY());
            if (distRight < 40) {
            //   console.log("BUUUUUUUUUM");
              fireworks.push(new Firework(coordinates.indexRightX, coordinates.indexRightY, false, 100));
              balls.splice(i, 1);
            }
            for (let i = fireworks.length - 1; i >= 0; i--) {
              fireworks[i].update(coordinates.indexRightY);
              fireworks[i].show();
              
              if (fireworks[i].done()) {
                fireworks.splice(i, 1);
              }
            }
          }


        if (coordinates.indexLeftX != null && coordinates.indexLeftY != null) {
            let distRight = dist(coordinates.indexLeftX, coordinates.indexLeftY, balls[i].getX(), balls[i].getY());
            // console.log(coordinates.indexLeftX, coordinates.indexLeftY, balls[i].getX(), balls[i].getY());
            if (distRight < 40) {
            //  console.log("BUUUUUUUUUM");
                fireworks.push(new Firework(coordinates.indexLeftX, coordinates.indexLeftY, false, 100));
                balls.splice(i, 1);
            }
            for (let i = fireworks.length - 1; i >= 0; i--) {
                fireworks[i].update(coordinates.indexLeftY);
                fireworks[i].show();
                
                if (fireworks[i].done()) {
                fireworks.splice(i, 1);
                }
            }
        }
    } 
}

