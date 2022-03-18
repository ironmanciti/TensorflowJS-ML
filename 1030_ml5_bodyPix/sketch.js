let bodypix;
let segmentation;
let img;
//image load
function preload() {
    img = loadImage('images/harriet.jpg');
    // img = loadImage('images/body2.jpg');
}

function setup() {
    createCanvas(480, 560);
    bodypix = ml5.bodyPix(modelReady) //model load
}

function modelReady() {
    console.log('ready!')
    bodypix.segment(img, gotResults) //body pixel 분리
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    segmentation = result;

    background(255);
    image(img, 0, 0, width, height)
    image(segmentation.maskBackground, 0, 0, width, height)
}

