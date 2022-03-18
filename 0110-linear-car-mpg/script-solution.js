//carsData data 중 자동차 마력을 기준으로 연비 예측하는 Linear Model 작성
//Data load
//Missing data cleansing - 갤런당 마일이나 마력이 정의되지 않은 항목 삭제
async function getData() {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataReq.json();
  const cleaned = carsData.map(car => ({
      x: car.Miles_per_Gallon,
      y: car.Horsepower,
    }))
    .filter(car => (car.x != null && car.y != null));
  return cleaned;
}

//data 를 shuffling하고 tensor 로 convert 및 normalizing 
function convertToTensor(data) {
  return tf.tidy(() => { //중간 텐서 모두 삭제
    // Step 1. data shuffling
    tf.util.shuffle(data);

    // Step 2. data 를 input/label Tensor로 변환
    const inputs = data.map(d => d.x);
    const labels = data.map(d => d.y);
    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normedInputs,
      labels: normedLabels,
      // evaluation 및 predict 단계에서 사용할 min, max data
      // 출력을 정규화하지 않은 원래의 상태로 다시 되돌려서 원래의 조정으로 가져오고 향후 입력 데이터를 
      // 동일한 방식으로 정규화할 수 있도록 학습 중에 정규화에 사용한 값을 유지
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });
}

// NN 모델 생성
//input : 마력, output : 연비
function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [1],
    units: 16,
    action: 'relu'
  }));
  model.add(tf.layers.dense({
    units: 32,
    action: 'relu'
  }));
  model.add(tf.layers.dense({
    units: 1
  }));
  return model;
}
// NN model compile and train
async function trainModel(model, inputs, labels) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  const batchSize = 32;
  const epochs = 20;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks({
        name: 'Training Performance'
      },
      ['mse'], {
        height: 200,
        callbacks: ['onEpochEnd']
      }
    )
  });
}

function testModel(model, X_test, y_test, tensorData) {

  const {
    inputMax,
    inputMin,
    labelMax,
    labelMin
  } = tensorData;
  // 훈련된 model 을 이용하여 test data prediction
  let preds = model.predict(X_test);
  // 원래 scale로 de-normalization
  preds = preds.mul(labelMax.sub(labelMin)).add(labelMin).dataSync();
  const unNormedX = X_test.mul(inputMax.sub(inputMin)).add(inputMin).dataSync();
  const unNormedY = y_test.mul(labelMax.sub(labelMin)).add(labelMin).dataSync();

  // tf array는 Float32Array type 이므로 
  // Array.from() method 로 일반 array 전환 및 object 변환
  // Array.prototype.map((element, index) => { ... })
  const predictedPoints = Array.from(unNormedX).map((val, i) => {
    return {
      x: val,
      y: preds[i]
    }
  })
  const originalPoints = Array.from(unNormedX).map((val, i) => {
    return {
      x: val,
      y: unNormedY[i]
    }
  })

  //시각화 하여 input의 원래 label 과 prediction 비교
  tfvis.render.scatterplot({
    name: 'Model Prediction vs Test data'
  }, {
    values: [originalPoints, predictedPoints],
    series: ['original', 'predicted'],
  }, {
    xLabel: '마력',
    yLabel: '연비',
    height: 300
  })

}

// main run 함수
async function run() {
  // 훈련할 원본 입력 데이터를 로드하고 플로팅
  const data = await getData();

  //input data 분포 시각화
  tfvis.render.scatterplot({
    'name': '마력 vs 연비'
  }, {
    values: data
  }, {
    xLabel: '마력',
    yLabel: '연비',
    height: 300
  })

  //NN model 생성
  const model = createModel();
  tfvis.show.modelSummary({
    name: 'Model 요약'
  }, model);

  //data 를 tensor 로 변환
  const tensorData = convertToTensor(data);
  const {
    inputs,
    labels
  } = tensorData;
  const testSize = 50
  const [X_train, X_test] = tf.split(inputs, [inputs.size - testSize, testSize]);
  const [y_train, y_test] = tf.split(labels, [labels.size - testSize, testSize]);

  //model train
  await trainModel(model, X_train, y_train);
  console.log("Train 완료")

  //model test
  testModel(model, X_test, y_test, tensorData);

}

document.addEventListener('DOMContentLoaded', run);
