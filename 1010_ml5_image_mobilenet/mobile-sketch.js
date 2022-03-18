//ml5.imageClassifier() 를 이용하여 image 의 
//label 과 confidence 를 display
let img;
let classifier, predicted, prob;

//image Classifier load
function preload() {
   
}

function setup() {
    createCanvas(400, 400);
    const input = createFileInput(handleFile);
    input.position(0, 0);
    select("#status").html("Model Ready");
}

function draw() {
    background(255);
    //image display
    if (img) {
        image(img, 0, 0, width, height);
    }
    //probability display
    if (prob) {
        fill(0, 0, 0);
        textSize(20);
        text(predicted, 10, height - 30);
        text(nf(prob, 0, 2), 10, height);
    }
}

//image file load 및 분류
function handleFile(file) {
    
}
// classify callback function
function gotResult(err, result) {
    
}
