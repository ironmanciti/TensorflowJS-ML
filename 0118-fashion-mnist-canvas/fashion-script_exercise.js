import { FMnistData } from "./fashion-data.js";
const EPOCHS = 5;
let ctx, rawImage, model;
let pos = {
  x: 0,
  y: 0
};

async function run() {
  const data = new FMnistData();
  console.log("Data Loading...");
  await data.load();
  console.log("Model Build...");
  //model build
  model_build();
  await tfvis.show.modelSummary({ name: "Model Summary", tab: "Data" }, model);
  await train(data);
  console.log("Train complete !!");
  //그림 분류 시작
  init();
  alert("훈련 종료!, 마우스로 Fashion 그림을 그려서 분류해 보세요.");
}

document.addEventListener("DOMContentLoaded", run);

function model_build() {
  model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling"
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    })
  );
  model.add(
    tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling"
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    })
  );
  model.add(tf.layers.flatten());
  model.add(
    tf.layers.dense({
      units: 10,
      kernelInitializer: "varianceScaling",
      activation: "softmax"
    })
  );

  model.compile({
    optimizer: "rmsprop",
    loss: "categoricalCrossentropy",
    metrics: "accuracy"
  });
}

async function train(data) {
  console.log("Training....");
  const BATCH_SIZE = 512;
  const TRAIN_DATA_SIZE = 6000;
  const TEST_DATA_SIZE = 1000;
  //data 불러오기
  const [X_train, y_train] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
    return [d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]), d.labels];
  });
  const [X_test, y_test] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]), d.labels];
  });

  const history = await model.fit(X_train, y_train, {
    batchSize: BATCH_SIZE,
    validationData: [X_test, y_test],
    epochs: EPOCHS,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: "Training Performance", style: { height: "1000px" } },
      ["loss", "val_loss", "acc", "val_acc"]
    )
  });
}

function setPosition(e) {
  pos.x = e.clientX - 100;
  pos.y = e.clientY - 100;
}

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

function erase() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 280, 280);
}

function predict() {
  var raw = tf.browser.fromPixels(rawImage, 1);
  var resized = tf.image.resizeBilinear(raw, [28, 28]);
  var tensor = resized.expandDims(0);

  var prediction = model.predict(tensor);
  var pIndex = tf.argMax(prediction, 1).dataSync();

  var classNames = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot"
  ];

  alert(classNames[pIndex]);
}

function init() {
  const canvas = document.getElementById("canvas");
  rawImage = document.getElementById("canvasimg");
  ctx = canvas.getContext("2d");
  erase();

  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mousedown", setPosition);
  canvas.addEventListener("mouseenter", setPosition);

  const predButton = document.getElementById("sb");
  predButton.addEventListener("click", predict);
  const clearButton = document.getElementById("cb");
  clearButton.addEventListener("click", erase);
}
