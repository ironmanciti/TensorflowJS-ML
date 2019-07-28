let img;
let poses = [];
let poseNet;

function setup(){
    createCanvas(1200, 800);
    input = createFileInput((file) => {
        if (file.type === 'image'){
            img = createImg(file.data, imageReady);
            img.hide();
            frameRate(1);
        } else {
            img = null;
        }
    });
    input.position(10,70)
}

function imageReady(){
    let options = {
        imageScaleFactor: 1,
        minConfidence: 0.1
    }
    //assign poseNet
    poseNet = ml5.poseNet(() => {
        console.log('Model Loaded');
        poseNet.singlePose(img);
    }, options);

    //event listener to 'pose' event
    poseNet.on('pose', (results) => {
        poses = results;
    })
}

function draw(){
    background(255);
    if (poses.length > 0){        
        image(img, 0, 0);
        drawSkeleton(poses);
        drawKeypoints(poses);
    }
}

function drawSkeleton(){
    for (let i = 0; i < poses.length; i++){
        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++){
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x, partA.position.y, 
                    partB.position.x, partB.position.y);
        }
    }
}

function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
            }
        }
    }
}