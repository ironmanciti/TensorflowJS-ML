//MobileNet 의 feature extracting 기능과 ml5.KNNClassifier 를 이용하여 
//video 상으로 입력되는 image 를 reference data 로 이용하여 분류
//KNN algorithm 은 추가적인 training 과정이 필요 없음
let video;
let features;
let knnClassifier;
let div;
let labelP;

function preload(){
    features = ml5.featureExtractor('MobileNet', () => {
        console.log(features);
    })
    knnClassifier = ml5.KNNClassifier();
    console.log(knnClassifier);
}

function setup(){
    createCanvas(640, 480);
    video = createCapture(VIDEO, () => {
        console.log('Video Ready');
    });
    video.hide();
    const guide1 = createP('knn 분류의 기준이될 example 들을 입력하거나 저장된 model 을 load 하세요.');
    guide1.style("font-size", "16pt");
    const guide2 = createP('l - left, r - right, u - up, d - down');
    guide2.style("font-size", "16pt");

    const buttonA = createButton('Predict');
    buttonA.style("font-size", "12pt");
    buttonA.mousePressed(() => {
        predict();
    })

    //knnClassifier model 저장
    const buttonB = createButton('Save KNN model');
    buttonB.style("font-size", "12pt");
    buttonB.mousePressed(() => {
        knnClassifier.save('KNN_model');
    })

    //저장한 knnClassifier model upload
    const buttonC = createButton('Load KNN model');
    buttonC.style("font-size", "12pt");
    buttonC.mousePressed(() => {
        knnClassifier.load('./KNN_model.json', () => {
            const counts = knnClassifier.getCountByLabel();
            console.log(counts);
        });
    })

    div = createDiv();
}

function draw(){
    background(0);
    image(video, 0, 0);
    fill(255, 0, 255);
    textSize(64);
    text(labelP, width/2, height-10);
}

function keyPressed(){
    const logits = features.infer(video);
    if (key == 'l'){
        knnClassifier.addExample(logits, "left");
        console.log('left');
    } else if (key == 'r'){
        knnClassifier.addExample(logits, "right");
        console.log('right');
    } else if (key == 'u'){
        knnClassifier.addExample(logits, "up");
        console.log('up');
    } else if (key == 'd'){
        knnClassifier.addExample(logits, "down");
        console.log('down');
    }
    
}

// cosine 유사도를 이용한 knn prediction
function predict(){
    //featureExtractor.infer() 를 call 하여 image 의 지문을 구함
    const logits = features.infer(video);

    if (knnClassifier.getNumLabels() > 0){
        knnClassifier.classify(logits, (err, result) => {
            if (err){
                console.log(err);
            } else {
                labelP = result.label;
                div.html(labelP);
                predict();
            } 
        });
    } else {
        div.html('No example entered yet')
    }
}
