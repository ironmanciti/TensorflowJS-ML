//MobileNet 의 pre-train 된 feature 를 그대로 사용하되
//featureExtractor.config.numLabels 을 조정하여 softmax class 수 조정
//featureExtractor.classification 에 addImage() 로 train example 추가하고
//train(callback) 으로 top layer 를 re-train
//classify() 로 분류
let video;
let featureExtractor;
let classifier;
let label;

function setup(){
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    //The model from which extract the learned features
    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    //Use the features of MobileNet as a classifier
    classifier = featureExtractor.classification(video, videoReady);
    //create Buttons
    setupButtons();
}

function draw(){
    image(video, 0, 0, width, height);
    fill(255, 0, 255);
    textSize(64);
    text(label, 50, height-50);
}

// MobileNet 의 final output 을 원래의 1000 개가 아닌 3 개로 변경
function modelReady(){
    featureExtractor.config.numLabels = 3; //3 classes
    console.log(featureExtractor);
    console.log('MobileNet loaded !');
}

function videoReady(){
    console.log(classifier);
    console.log('Video ready !');
}
//data collection - 3 가지 표정의 image 를 
//featureExtractor.classification object 에 training example 로 추가
function setupButtons(){
    createP('')
    const buttonA = createButton('행복한 표정');
    let countA = 0;
    buttonA.mousePressed(() => {
        classifier.addImage('행복한 표정'); //Adds a new image to buttonA
        buttonA.elt.innerText = '행복한 표정 ' + ++countA;
    })
    const buttonB = createButton('슬픈표정');
    let countB = 0;
    buttonB.mousePressed(() => {
        classifier.addImage('슬픈표정'); //Adds a new image to buttonB
        buttonB.elt.innerText = '슬픈표정 ' + ++countB;
    })
    const buttonC = createButton('화난표정');
    let countC = 0;
    buttonC.mousePressed(() => {
        classifier.addImage('화난표정'); //Adds a new image to buttonC
        buttonC.elt.innerText = '화난표정 ' + ++countC;
    })

    //Re-train the model with the provided images and labels 
    const buttonT = createButton('train');
    buttonT.mousePressed(() => {
        classifier.train(whileTraining);
    })
    const buttonG = createButton('start guessing');
    buttonG.mousePressed(() => {
        predict();
    })
}

//training 중의 loss 를 print
function whileTraining(loss){
    if (loss === null){
        console.log('Train complete');
    } else {
        console.log(loss);
    }
}

function predict(){
    classifier.classify(video, gotResult);
}

function gotResult(err, result) {
    if (err) {
        console.log(err);
    } else {
        label = result[0].label; //첫번째 예측값 
        predict();               //recursive call
    }
}