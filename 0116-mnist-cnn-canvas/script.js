let ctx;
let rawImage;
let model;
let pos = { x: 0, y: 0 };

//저장되었던 model load
async function getModel() {
  model = await tf.loadLayersModel("indexeddb://my-model-1");
  model.summary();
  return model;
}

//mouse position
function setPosition(e) {
  pos.x = e.clientX - 100;
  pos.y = e.clientY - 100;
}

// 손글씨 그리기
function draw(e) {
  if (e.buttons != 1) return;
  ctx.beginPath();
  ctx.lineWidth = 24;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  rawImage.src = canvas.toDataURL("image/png");
}

function predict() {
  const raw = tf.browser.fromPixels(rawImage, 1);
  const resized = tf.image.resizeBilinear(raw, [28, 28]);
  const tensor = resized.expandDims(0);
  const prediction = model.predict(tensor);
  const pIndex = tf.argMax(prediction, 1).dataSync();
  alert(pIndex);
}
//canvas 초기화
function erase() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 280, 280);
}
//event listner 생성
function init() {
  const canvas = document.getElementById("canvas");
  rawImage = document.getElementById("canvasimg");
  ctx = canvas.getContext("2d");
  erase();

  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mousedown", setPosition);
  canvas.addEventListener("mouseenter", setPosition);

  const predButton = document.getElementById("pb");
  predButton.addEventListener("click", predict);
  const clearButton = document.getElementById("cb");
  clearButton.addEventListener("click", erase);
}

async function run() {
  model = getModel();
  init();
  alert("model ready !!, 손글씨를 작성하여 인식시켜 보세요 !");
}

document.addEventListener("DOMContentLoaded", run);
