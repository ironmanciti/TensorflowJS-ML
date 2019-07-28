let video;
let posenet;
let noseX = 0;
let noseY = 0;
let eyeX = 0;
let eyeY = 0;
let rsX = 0;
let rsY = 0;

function setup(){
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();

    //ml5.poseNet loading
    posenet = ml5.poseNet(video, () => {
        console.log('Model ready');
    })
    //event listener 설정
    posenet.on('pose', gotPose);
}

function gotPose(poses){
    if (poses.length > 0){
        //https://github.com/tensorflow/tfjs-models/tree/master/posenet 참조
        let newX = poses[0].pose.nose.x;
        let newY = poses[0].pose.nose.y;
        let newEyeX = poses[0].pose.leftEye.x;
        let newEyeY = poses[0].pose.leftEye.y;
        let nrsX = poses[0].pose.rightShoulder.x;
        let nrsY = poses[0].pose.rightShoulder.y;
        noseX = lerp(noseX, newX, 0.5);
        noseY = lerp(noseY, newY, 0.5);
        eyeX = lerp(eyeX, newEyeX, 0.5);
        eyeY = lerp(eyeY, newEyeY, 0.5);
        rsX = lerp(rsX, nrsX, 0.5);
        rsY = lerp(rsY, nrsY, 0.5);
    }
}

function draw(){
    image(video, 0, 0);
    fill(255,0,0,);
    //거리에 따라 도형 크기 조정
    let d = dist(noseX, noseY, eyeX, eyeY);
    //코는 원형
    ellipse(noseX, noseY, d)
    //눈은 사각형
    rectMode(CENTER);
    rect(eyeX, eyeY, d/2, d/2);
    rect(rsX, rsY, d/2, d/2);
    //코와 어깨사이의 선 긋기
    stroke(255, 0, 0);
    line(noseX, noseY, rsX, rsY);
}