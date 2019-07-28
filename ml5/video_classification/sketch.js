//기본적인 image-classification 을 video 로 확장
let video;
let classifier;
let label;
let prob;

function preload(){
  classifier = ml5.imageClassifier('mobileNet', video);
}

function setup(){
  createCanvas(640, 480);
  background(0);

  video = createCapture(VIDEO);
  video.hide();

  // button = createButton('click me');
  // button.position(10, 300);
  // button.size(100, 50);
  //button.mousePressed(() => {
  // classifier.classify(video, gotResult);
  //});
}

function draw(){
  image(video, 0, 0, width, height);

  classifier.classify(video, gotResult);

  fill(255,0,255);
  textSize(16);
  text(label, 10, height-30);
  text(prob, 10, height-10);
}

function gotResult(err, result){
  if (err){
    console.log(err);
  } else {
    label = result[0].label;
    prob = result[0].confidence;
  }
}
