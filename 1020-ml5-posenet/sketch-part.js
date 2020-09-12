let img;
let poseNet;
let pose;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, () => console.log("model loaded"));
  poseNet.on("pose", (result) => (pose = result[0].pose));
}

function draw() {
  image(video, 0, 0);
  if (pose) {
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, 32);
    ellipse(pose.leftEye.x, pose.leftEye.y, 32);
    ellipse(pose.rightEye.x, pose.rightEye.y, 32);
  }
}

