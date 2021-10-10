// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
// Create a YOLO method
const yolo = ml5.YOLO(()=>(console.log('model ready...')));
let img;
let objects = [];
let status;

function setup() {
    createCanvas(640, 420);
    // img = createImg('images/cat.jpg', imageReady);
    img = createImg('images/cat2.jpg', imageReady);
    img.hide();
}

// image load 되면, object 위치 prediction
function imageReady() {
    console.log('Detecting')
    yolo.detect(img, gotResult);
}

function gotResult(err, results) {
    if (err) {
        console.log(err);
    }
    console.log(results)
    objects = results;
}

function draw() {
    // unless the model is loaded, do not draw anything to canvas
    if (yolo) {
        image(img, 0, 0)

        for (let i = 0; i < objects.length; i++) {
            noStroke();
            fill(0, 255, 0);
            text(objects[i].label + " " + nfc(objects[i].confidence * 100.0, 2) + "%", 
                            objects[i].x * width + 5, objects[i].y * height + 15);
            noFill();
            strokeWeight(4);
            stroke(0, 255, 0);
            rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
        }
    }
}

