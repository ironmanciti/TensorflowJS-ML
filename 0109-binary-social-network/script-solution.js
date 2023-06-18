let model;      // 학습할 모델
let dataPoints; // 로드된 데이터를 저장할 변수
let X_train, X_test, y_train, y_test;  // 학습 및 테스트 데이터
let normParams;   // 정규화를 위한 최소값, 최대값 저장

//tfvis의 visor toggle
function toggleVisor() {
  tfvis.visor().toggle();
}

// Min-Max 정규화 함수
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

//data point 시각화
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

  let dataset = await socialSales
    .map(({xs, ys}) => ({
      x: Object.values(xs),
      y: Object.values(ys),
    }));

  dataPoints = await dataset.toArray();
  tf.util.shuffle(dataPoints);

  // 카테고리 변수 처리 (Male -> 1, Female -> 0)
  dataPoints.map(v => {
    if (v.x[0] === "Male") {
      v.x[0] = 1;
    } else if (v.x[0] === "Female") {
      v.x[0] = 0;
    }
  });

  console.log(dataPoints.length);
  console.log(dataPoints);

  plot(dataPoints);

  // feature extraction and tensor 변환
  const featureValues = dataPoints.map(p => p.x);
  const labelValues = dataPoints.map(p => p.y);

  const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 3]);
  const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

  // 훈련용/테스트용 데이터 셋 분리 (75% 훈련용, 25% 테스트용)
  const trainLen = Math.floor(featureTensor.shape[0] * 0.75);
  const testLen = labelTensor.shape[0] - trainLen;

  [X_train, X_test] = tf.split(featureTensor, [trainLen, testLen]);
  [y_train, y_test] = tf.split(labelTensor, [trainLen, testLen]);

  // 데이터 정규화 (MinMaxScaling)
  const normedTrainTensor = MinMaxScaling(X_train);
  normParams = {min: normedTrainTensor.min, max: normedTrainTensor.max};
  X_train.dispose();
  X_train = normedTrainTensor.tensor;

  const normedTestTensor = MinMaxScaling(X_test, normParams.min, normParams.max);
  X_test.dispose();
  X_test = normedTestTensor.tensor;

  // 모델 훈련 버튼 활성화
  document.getElementById("train-button").removeAttribute("disabled");
}

async function train() {
  // layers API 를 이용하여 sequential model 구축
  document.getElementById("model-status").innerHTML = "Training...";

  // sequential 모델 생성 및 설정
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

  // 모델 훈련 (fit)
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

  // 예측 버튼 활성화 및 훈련 완료 알림
  document.getElementById("predict-button").removeAttribute("disabled");
  document.getElementById("model-status").innerHTML =
    "train complete, start prediction !!";

  // confusion matrix 생성 및 시각화
  const predictions = model.predict(X_test);
  const predClasses = tf.tidy(() =>
    tf.floor(predictions.add(0.5))
      .transpose()
      .squeeze()
  );
  const trueClasses = tf.tidy(() =>
    tf.floor(y_test.add(0.5))
      .transpose()
      .squeeze()
  );

  //confusion matrix
  const confusionMatrix = await tfvis.metrics.confusionMatrix(
    trueClasses,
    predClasses
  );
  const container = { name: "Confusion Matrix", tab: "혼동행렬" };
  const data = { values: confusionMatrix };
  tfvis.render.confusionMatrix(container, data);

  //memory 정리
  predictions.dispose();
  predClasses.dispose();
  trueClasses.dispose();
}

// 모델을 이용한 예측 함수
async function predict() {
  // 예측에 필요한 입력 값 받아오기
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
    const normedTensor = MinMaxScaling(tempTensor, normParams.min, normParams.max);
    tempTensor.dispose();
    // 입력 값으로 예측 수행
    const prediction = model.predict(normedTensor.tensor);
    let predicted;
    if (prediction.dataSync()[0] > 0.5) {
      predicted = "구매";
    } else {
      predicted = "비구매";
    }
    // 예측 결과 출력
    document.getElementById(
      "predict-output"
    ).innerHTML = `예측된 분류 - ${predicted}`;
  }
}

// 웹 페이지 로딩이 완료되면 run 함수 실행
document.addEventListener("DOMContentLoaded", run);
