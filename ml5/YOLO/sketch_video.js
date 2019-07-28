let model;
let objects = [];
let video;

function setup(){
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    model = ml5.YOLO(video, () => {
        console.log('Model is Ready');
        detect();
    });
}

function draw(){
    background(0);
    image(video, 0, 0, width, height);
    for (let i = 0; i < objects.length; i++){
        fill(0, 0,  255);
        noStroke();
        textSize(30);
        text(objects[i].label, objects[i].x * width, objects[i].y * height-5);
        noFill();
        strokeWeight(4);
        stroke(0, 0, 255);
        rect(objects[i].x * width, objects[i].y * height, 
                objects[i].w * width, objects[i].h * height);
    }
}

function detect(){
     model.detect((err, result) => {
         if (err) {
             throw Error;
         }
         objects = result;
         detect();
     })
}