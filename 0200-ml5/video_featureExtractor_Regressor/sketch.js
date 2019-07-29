//mobilenet 의 feature 를 extract 하고 regression 으로 이용
//slider bar 를 이용하여 addImage(value) 로 train example 추가
//video 에서 capture 한 image 를 regression
let model;
let video;
let regressor;
let slider;
let train;
let prediction;

function preload(){
    model = ml5.featureExtractor('MobileNet');
}

function setup(){
    createCanvas(640, 480);
    background(0);
    video = createCapture(VIDEO);
    video.hide();
    //regression model
    regressor = model.regression(video, () => {
        console.log('Video Ready');
    });

    createP('<br>')
    slider = createSlider(0, 1, 0.5, 0.01); //min, max, init, increment
    // slider.input(() => {
    //     console.log(slider.value())
    // })
    createP('<br>')

    addTrainSample = createButton('Add Train Sample');
    addTrainSample.mousePressed(() => {
        regressor.addImage(slider.value()); //addImage with value
        console.log(slider.value());
    })

    train = createButton('train');
    train.mousePressed(() => {
        regressor.train((loss) => {
            if (loss === null){
                console.log('Train complete');
                predict();
            } else {
                console.log(loss);
            }
        })
    })
}

function draw(){
    background(0);
    image(video, 0, 0, width, height);
    
    //image 에 맞추어 regression 값 위치에 사각형 draw
    rectMode(CENTER);
    fill(255, 0, 255);
    rect(prediction * width, height/2, 50, 50);

    // textSize(32);
    // text(prediction, 50, height-50);
}

function predict(){
    regressor.predict(video, (err, result) => {
        if (err){
            console.log(err);
        } else {     
            prediction = result.value;             
            predict();
        }
    });
}

