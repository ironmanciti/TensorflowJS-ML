let img;
let poseNet;
let poses = [];   //multi pose 감안 empty array 로 선언

function setup() {
    const srcimg = document.getElementById("imgsrc");
    img = createImg(srcimg, imageReady);
    img.hide();
    frameRate(1);
}

function imageReady(){
    //imgage size 에 canvas size 를 맞추어 주어야
    //skeleton draw 시 사진 position 과 일치
    createCanvas(img.width, img.height);
    let options = {
        imageScaleFactor: 1, //낮추면 정확도 희생하고 speed-up
        minConfidence: 0.1
    }

    poseNet = ml5.poseNet(modelReady, options);
    //event listener 생성
    poseNet.on('pose', (results) => {
        poses = results;
    })
}

async function modelReady(){
    document.getElementById("status").innerHTML = 'model loaded';
    //single pose event 발생
    await poseNet.singlePose(img);
    console.log(poses);
}

//poses 에 data 들어올 때까지 loop
//single pose 이므로 skeleton 그리면 loop stop
function draw() {
    background(200);
    if (poses.length > 0){
        image(img, 0, 0, width, height);
        drawSkeleton();
        drawKeypoints();
        noLoop();  //stop looping
        }
}

// 골격을 연결하는 line 그리기
function drawSkeleton(){
    let skeleton = poses[0].skeleton;
    for (let i = 0; i < skeleton.length; i++){
        let partA = skeleton[i][0];
        let partB = skeleton[i][1];
        stroke(255);
        strokeWeight(1);
        line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
}
//detect 된 pose keypoints 원으로 표시
function drawKeypoints(){
    let pose = poses[0].pose;
    for (let i = 0; i < pose.keypoints.length; i++){
        let keypoint = pose.keypoints[i];
        if (keypoint.score > 0.2){
            fill(255);
            stroke(20);
            strokeWeight(4);
            ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
        }
    }
}