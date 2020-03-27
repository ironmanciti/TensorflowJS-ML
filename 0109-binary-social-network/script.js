const EPOCHS = 50;
let model;
let dataPoints;
let X_train, X_test, y_train, y_test;
let normedFeatureTensor;

function toggleVisor() {
  tfvis.visor().toggle();
}

function MinMaxScaling(tensor, prevMin = null, prevMax = null) {
  const min = prevMin || tensor.min();
  const max = prevMax || tensor.max();
  const normedTensor = tensor.sub(min).div(max.sub(min));
  return {
    tensor: normedTensor,
    min,
    max
  };
}

//data plot
async function plot(dataPoints) {
  const surface = { name: "Binary Scatterplot", tab: "Data" };
  const series1 = dataPoints
    .filter(v => v.y[0] === 1)
    .map(v => ({
      x: v.x[1],
      y: v.x[2]
    }));
  const series2 = dataPoints
    .filter(v => v.y[0] === 0)
    .map(v => ({
      x: v.x[1],
      y: v.x[2]
    }));
  const data = { values: [series1, series2], series: ["구매", "비구매"] };
  const opts = { xLabel: "Age", yLabel: "Salary" };
  tfvis.render.scatterplot(surface, data, opts);
}

async function run() {
  // csv data loading
  const dataUrl = "Social_Network_Ads.csv";

  const socialSales = tf.data.csv(dataUrl, {
    columnNames: ["UserID", "Gender", "Age", "EstimatedSalary", "Purchased"],
    columnConfigs: {
      Gender: { isLabel: false },
      Age: { isLabel: false },
      EstimatedSalary: { isLabel: false },
      Purchased: { isLabel: true }
    },
    configuredColumnsOnly: true
  });

  dataPoints = await socialSales
    .map(({ xs, ys }) => {
      return { x: Object.values(xs), y: Object.values(ys) };
    })
    .toArray();

  plot(dataPoints);

  //data 가 섞여있지 않으므로 shuffle
  dataPoints = _.shuffle(dataPoints);

  // category 변수 처리
  dataPoints.map(v => {
    if (v.x[0] === "Male") {
      v.x[0] = 1;
    } else if (v.x[0] === "Female") {
      v.x[0] = 0;
    }
  });

  // feature extraction and tensor 변환
  const featureValues = dataPoints.map(v => v.x);
  const labelValues = dataPoints.map(v => v.y);

  const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 3]);
  const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

  //data normalization
  normedFeatureTensor = MinMaxScaling(featureTensor);

  featureTensor.dispose();

  // train / test set split
  const trainLen = Math.floor(normedFeatureTensor.tensor.shape[0] * 0.75);
  const testLen = labelTensor.shape[0] - trainLen;

  [X_train, X_test] = tf.split(normedFeatureTensor.tensor, [trainLen, testLen]);
  [y_train, y_test] = tf.split(labelTensor, [trainLen, testLen]);

  document.getElementById("train-button").removeAttribute("disabled");
}

async function train() {
  // layers API 를 이용하여 sequential model 구축
  document.getElementById("model-status").innerHTML = "Training...";
  model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [3],
      units: 50,
      activation: "relu"
    })
  );
  model.add(
    tf.layers.dense({
      units: 20,
      activation: "relu"
    })
  );
  model.add(
    tf.layers.dense({
      units: 1,
      activation: "sigmoid"
    })
  );
  model.compile({
    loss: "binaryCrossentropy",
    optimizer: "adam",
    metrics: ["accuracy"]
  });
  tfvis.show.modelSummary({ name: "Model Summary" }, model);
  const history = await model.fit(X_train, y_train, {
    epochs: EPOCHS,
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
    "train complete, start prediction !!";

  //confusion maxtrix 시각화
  const predictions = model.predict(X_test);
  const predClasses = tf.tidy(() =>
    tf
      .floor(predictions.add(0.5))
      .transpose()
      .squeeze()
  );
  const trueClasses = tf.tidy(() =>
    tf
      .floor(y_test.add(0.5))
      .transpose()
      .squeeze()
  );

  //confusion matrix
  const confusionMatrix = await tfvis.metrics.confusionMatrix(
    trueClasses,
    predClasses
  );
  const container = { name: "Confusion Matrix", tab: "혼돈행렬" };
  const data = { values: confusionMatrix };
  tfvis.render.confusionMatrix(container, data);

  //memory 정리
  predictions.dispose();
  predClasses.dispose();
  trueClasses.dispose();
}

async function predict() {
  const predInputOne = parseInt(
    document.getElementById("predict-input-1").value
  );
  const predInputTwo = parseInt(
    document.getElementById("predict-input-2").value
  );
  const predInptThree = parseInt(
    document.getElementById("predict-input-3").value
  );
  if (isNaN(predInputTwo) || isNaN(predInputTwo) || isNaN(predInptThree)) {
    alert("숫자를 입력하세요");
  } else {
    const features = [predInputOne, predInputTwo, predInptThree];
    //tensor 변환
    const tempTensor = tf.tensor2d(features, [1, 3]);
    const normedTensor = MinMaxScaling(
      tempTensor,
      normedFeatureTensor.min,
      normedFeatureTensor.max
    );
    tempTensor.dispose();
    const prediction = model.predict(normedTensor.tensor);
    let predicted;
    if (prediction.dataSync()[0] > 0.5) {
      predicted = "구매";
    } else {
      predicted = "비구매";
    }
    document.getElementById(
      "predict-output"
    ).innerHTML = `예측된 분류 - ${predicted}`;
  }
}

document.addEventListener("DOMContentLoaded", run);
