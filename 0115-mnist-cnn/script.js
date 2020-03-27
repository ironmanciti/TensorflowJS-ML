import { MnistData } from "./mnistData.js";
const EPOCHS = 1;

async function run() {
  const data = new MnistData();
  await data.load();
  //sample data 를 visor 상에 plot
  await showExamples(data);

  //model build
  const model = model_build();
  await tfvis.show.modelSummary({ name: "Model Summary", tab: "Data" }, model);

  //model train
  await train(model, data);

  //trained model save
  await model.save("indexeddb://my-model-1");

  console.log("End Training and model saved 'indexeddb://my-model-1' !!");

  //Evaluation
  const testSize = 100;
  const testData = data.nextTestBatch(testSize);
  const testXs = testData.xs.reshape([testSize, 28, 28, 1]);
  const labels = testData.labels.argMax(1);
  const preds = model.predict(testXs).argMax(1);

  testXs.dispose();

  await showAccuracy(labels, preds);
  await showConfusion(labels, preds);

  labels.dispose();
  preds.dispose();
}

document.addEventListener("DOMContentLoaded", run);

async function showExamples(data) {
  //25 개 sample 을 minstData.js 에서 가져오기
  const examples = data.nextTestBatch(25);
  const numExamples = examples.xs.shape[0]; //25
  const exampleSize = examples.xs.shape[1]; //784

  //visor instance 생성
  const surface = tfvis
    .visor()
    .surface({ name: "Mnist Data Sample", tab: "Data" });

  // 25x784 인 examples.xs 를 25 개의 28x28x1 array 로 reshape
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      return examples.xs.slice([i, 0], [1, exampleSize]).reshape([28, 28, 1]);
    });
    const canvas = document.createElement("canvas");
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = "margin: 4px";
    //convert tensor to image pixel
    await tf.browser.toPixels(imageTensor, canvas);
    //visor surface 에 append
    surface.drawArea.appendChild(canvas);
    imageTensor.dispose();
  }
}

//model 정의 - tf.sequential layer API 를 이용하여 CNN 구축
function model_build() {
  const model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling" // same as He initializer for relu
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
    optimizer: tf.train.adam(),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  return model;
}

async function train(model, data) {
  console.log("Training....");
  const BATCH_SIZE = 512;
  const TRAIN_DATA_SIZE = 55000;
  const TEST_DATA_SIZE = 10000;
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
    callbacks: tfvis.show.fitCallbacks({ name: "Training Performance" }, [
      "loss",
      "acc",
      "val_loss",
      "val_acc"
    ])
  });
}

async function showAccuracy(labels, preds) {
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = { name: "Accuracy", tab: "Evaluation" };
  await tfvis.show.perClassAccuracy(container, classAccuracy);
}

async function showConfusion(labels, preds) {
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = { name: "Confusion Matrix", tab: "Evaluation" };
  await tfvis.render.confusionMatrix(container, { values: confusionMatrix });
}
