let X_train, X_test, y_train, y_test;
let model;
let labelNames = ["setosa", "versicolor", "virginica"];

function toggleVisor() {
  tfvis.visor().toggle();
}

async function plot(dataPoints) {
  const surface = { name: "Multi-classification", tab: "Data" };
  //데이터 포인트를 받아와 각각의 아이리스 꽃 종류(setosa, versicolor, virginica)에 따라 데이터를 분류
  //시각화를 위해 분류된 데이터에서 꽃받침(sepal) 길이와 꽃잎(petal) 길이를 가져와 새로운 데이터를 생성
  const series1 = dataPoints
    .filter(v => v.y === "setosa")
    .map(v => ({
      x: v.x[0],  //sepal_length
      y: v.x[2]   //petal_length
    }));
  const series2 = dataPoints
    .filter(v => v.y === "versicolor")
    .map(v => ({
      x: v.x[0],
      y: v.x[2]
    }));
  const series3 = dataPoints
    .filter(v => v.y === "virginica")
    .map(v => ({
      x: v.x[0],
      y: v.x[2]
    }));

  const data = { values: [series1, series2, series3], series: labelNames };
  const opts = { xLabel: "sepal_length", yLabel: "petal_length" };
  tfvis.render.scatterplot(surface, data, opts);
}

async function run() {
  // json data loading
  let iris = await fetch("iris.json");
  // convert json to array
  iris = await iris.json();
  let dataPoints = iris.map(x => ({
    x: [x.sepal_length, x.sepal_width, x.petal_length, x.petal_width],
    y: x.species
  }));

  // shuffle을 위해 array를 tf.data.Dataset으로 convert
  let dataset = tf.data.array(dataPoints);
  // Shuffle dataset
  dataset = dataset.shuffle(dataPoints.length);
  // Convert back to array
  dataPoints = await dataset.toArray();

  //data 시각화
  plot(dataPoints);

  //category 변수 처리
  dataPoints.map(v => {
    if (v.y === "setosa") {
      v.y = 0;
    } else if (v.y === "versicolor") {
      v.y = 1;
    } else if (v.y === "virginica") {
      v.y = 2;
    }
  });
  // tensor 변환
  const featureValues = dataPoints.map(v => v.x);
  const labelValues = dataPoints.map(v => v.y);

  const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 4]);
  //label을 one-hot-encoding
  let labelTensor = tf.tensor1d(labelValues, "int32");
  labelTensor = tf.oneHot(labelTensor, 3);

  //train / test split
  const trainLen = Math.floor(featureTensor.shape[0] * 0.75);
  const testLen = featureTensor.shape[0] - trainLen;
  [X_train, X_test] = tf.split(featureTensor, [trainLen, testLen]);
  [y_train, y_test] = tf.split(labelTensor, [trainLen, testLen]);

  document.getElementById("train-button").removeAttribute("disabled");
}

async function train() {
  document.getElementById("model-status").innerHTML = "Training....";
  // layers API 를 이용하여 model 구축
  model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [4],
      units: 100,
      activation: "relu"
    })
  );
  model.add(
    tf.layers.dense({
      units: 50,
      activation: "relu"
    })
  );
  model.add(
    tf.layers.dense({
      units: 3,
      activation: "softmax"
    })
  );
  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: "adam",
    metrics: ["accuracy"]
  });
  //summary 시각화
  tfvis.show.modelSummary({ name: "Model Summary" }, model);
  // training
  const history = await model.fit(X_train, y_train, {
    epochs: 30,
    batchSize: 32,
    validationData: [X_test, y_test],
    callbacks: tfvis.show.fitCallbacks({ name: "Training Performance" }, [
      "loss",
      "acc",
      "val_loss",
      "val_acc"
    ])
  });

  document.getElementById("predict-button").removeAttribute("disabled");
  document.getElementById("model-status").innerHTML =
    "학습 종료. 예측 시작!!";

  //confusion maxtrix 시각화
  const pred = model.predict(X_test);
  const trueValue = tf.tidy(() => y_test.argMax(1));
  const predValue = tf.tidy(() => pred.argMax(1));
  const confusionMatrix = await tfvis.metrics.confusionMatrix(
    trueValue,
    predValue
  );

  let container = { name: "Confusion Matrix", tab: "Evaluation" };
  tfvis.render.confusionMatrix(container, { values: confusionMatrix });

  //per class accuracy 시각화
  const classAccuracy = await tfvis.metrics.perClassAccuracy(
    trueValue,
    predValue
  );
  container = { name: "Accuracy per Classes", tab: "Evaluation" };
  tfvis.show.perClassAccuracy(container, classAccuracy);

  // memory 정리
  pred.dispose();
  trueValue.dispose();
  predValue.dispose();
}

async function predict() {
  const inputOne = parseInt(document.getElementById("predict-input-1").value);
  const inputTwo = parseInt(document.getElementById("predict-input-2").value);
  const inputThree = parseInt(document.getElementById("predict-input-3").value);
  const inputFour = parseInt(document.getElementById("predict-input-4").value);
  if (
    isNaN(inputOne) ||
    isNaN(inputTwo) ||
    isNaN(inputThree) ||
    isNaN(inputFour)
  ) {
    alert("숫자만 입력 가능합니다.");
  } else {
    const features = [inputOne, inputTwo, inputThree, inputFour];
    const featureTensor = tf.tensor2d(features, [1, 4]);
    const prediction = model.predict(featureTensor);
    const idx = prediction.argMax(1).dataSync();
    document.getElementById(
      "predict-output"
    ).innerHTML = `Predicted Class = ${labelNames[idx]}`;
  }
}

document.addEventListener("DOMContentLoaded", run);