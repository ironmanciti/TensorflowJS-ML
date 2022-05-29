let video;
let posNet;
let poses = [];

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    posNet = ml5.poseNet(video, () => {
        select('#status').html("Model Loaded");
    });

    posNet.on("pose", (results) => {
        poses = results;
    })
}

function draw(){
    image(video, 0, 0);
    drawKeyPoints();
    drawSkeleton();
}

function drawKeyPoints(){
    if (poses.length > 0) {
        const pose = poses[0].pose;
        for (let i=0; i < pose.keypoints.length; i++){
            const keypoint = pose.keypoints[i];
            if (keypoint.score > 0.2){
                fill(255, 0, 0);  
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }  
}

function drawSkeleton(){
    if (poses.length > 0) {
        const skeleton = poses[0].skeleton;
        for (let i = 0; i < skeleton.length; i++) {
            const partA = skeleton[i][0];
            const partB = skeleton[i][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y)
        }
    }
}