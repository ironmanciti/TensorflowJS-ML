//ml5.imageClassifier() 를 이용하여 image 의 label 과 confidence 를 
//화면에 display
let classifier;
let img;

//p5.js 의 preload() 함수 이용
function preload(){
  classifier = ml5.imageClassifier('MobileNet');
  img = loadImage('./images/bird.png');
}

function setup(){
  createCanvas(640, 480);
  background(0);
  image(img, 0, 0, width, height);
  classifier.classify(img, gotResult);
}

function gotResult(err, result){  
  if (err){
    console.log(err);
  } else {
    console.log(result);
    const label = result[0].label;  //분류 결과
    const prob = result[0].confidence;  //확률
    fill(255, 0, 255);
    textSize(64);
    text(label, 10, height-10);
    createDiv(label);
    createDiv('Confidence: ' + nf(prob, 0, 2)); //nf: number format
  }
}
