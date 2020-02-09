function setup() {
  createCanvas(800, 600); 
}

let pX = 100;
let pY = 100;
function draw(){
  background(204);
  circle(pX, pY, 30);
  console.log(width, height);
}

function mousePressed(){
  console.log(mouseX, mouseY)
  pX = mouseX;
  pY = mouseY;
}


