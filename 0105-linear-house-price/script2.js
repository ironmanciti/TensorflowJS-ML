const EPOCHS = 50;

let normedFeatureTensor, normedLabelTensor, model;

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

function denormalize(tensor, min, max) {
  return tensor.mul(max.sub(min)).add(min);
}

//train
async function train() {
  const HouseSalesDataset = tf.data.csv("kc_house_data.csv", {
    columnConfigs: {
      sqft_living: { isLabel: false },
      price: { isLabel: true }
    },
    configuredColumnsOnly: true
  });

  //csv 파일 읽기
  console.log("** CSV file =");
  console.log(await HouseSalesDataset.take(5).toArray());

  //시각화
  const dataPoints = await HouseSalesDataset.map(({ xs, ys }) => ({
    x: Object.values(xs),
    y: Object.values(ys)
  })).toArray();

  let surface = { name: "면적 vs 가격", tab: "Data" };
  let data = { values: [dataPoints] };
  let opts = { xLabel: "면적", yLabel: "가격" };
  tfvis.render.scatterplot(surface, data, opts);

  //feature extraction and tensor 변환
  const featureValues = dataPoints.map(p => p.x);
  const labelValues = dataPoints.map(p => p.y);

  const featureTensor = tf.tensor2d(featureValues, [
    featureValues.length,
    featureValues[0].length
  ]);
  const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

  //data normalization
  normedFeatureTensor = MinMaxScaling(featureTensor);
  normedLabelTensor = MinMaxScaling(labelTensor);

  console.log("** normalized feature tensor = ");
  normedFeatureTensor.tensor.print();
  console.log("** normalized label tensor = ");
  normedLabelTensor.tensor.print();

  //불필요한 tensor 를 memory 에서 삭제
  featureTensor.dispose();
  labelTensor.dispose();

  //normalized data 시각화
  const normedPoints = [];
  const normedFeatureArr = normedFeatureTensor.tensor.arraySync();
  const normedLabelArr = normedLabelTensor.tensor.arraySync();

  for (let i = 0; i < normedFeatureArr.length; i++) {
    normedPoints.push({ x: normedFeatureArr[i], y: normedLabelArr[i] });
  }

  surface = { name: "Normalized - 면적 vs 가격", tab: "Data" };
  data = { values: [normedPoints] };
  opts = { xLabel: "면적", yLabel: "가격" };
  tfvis.render.scatterplot(surface, data, opts);

  //train/test split
  const train_size = Math.floor(normedFeatureTensor.tensor.shape[0] * 0.75);
  const test_size = normedFeatureTensor.tensor.shape[0] - train_size;

  const [X_train, X_test] = tf.split(normedFeatureTensor.tensor, [
    train_size,
    test_size
  ]);
  const [y_train, y_test] = tf.split(normedLabelTensor.tensor, [
    train_size,
    test_size
  ]);

  //model build
  model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 10,
      inputShape: [1],
      activation: "relu"
    })
  );
  model.add(
    tf.layers.dense({
      units: 1,
      activation: "linear"
    })
  );
  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.sgd(0.001)
  });

  //model.summary()
  //model.summary 시각화
  tfvis.show.modelSummary({ name: "model summary", tab: "model" }, model);

  //callback 함수
  const container = { name: "Training Performance" };
  const metrics = ["loss", "acc", "val_loss"];
  const { onEpochEnd, onBatchEnd } = tfvis.show.fitCallbacks(
    container,
    metrics
  );

  const history = await model.fit(X_train, y_train, {
    epochs: EPOCHS,
    batchSize: 32,
    validationData: [X_test, y_test],
    callbacks: { onEpochEnd, onBatchEnd }
    // callbacks: { onEpochEnd : (epoch, log) => {
    //     console.log(`Epoch : ${epoch}: loss= ${log.loss.toFixed(4)},
    //         val_loss : ${log.val_loss.toFixed(4)}`)}}
  });

  // train, validation loss 출력
  const trainLoss = history.history.loss.pop();
  const validationLoss = history.history.val_loss.pop();
  console.log(
    `Train Loss = ${trainLoss} \nValidation Loss = ${validationLoss}`
  );

  //train 완료 후 prediction button 활성화
  document.getElementById("predict-button").removeAttribute("disabled");
}

async function predict() {
  const predictionInput = parseInt(
    document.getElementById("predict-input").value
  );
  if (isNaN(predictionInput)) {
    alert("숫자를 입력하세요");
  } else {
    tf.tidy(() => {
      const inputTensor = tf.tensor1d([predictionInput]);
      //normalize
      const normedInput = MinMaxScaling(
        inputTensor,
        normedFeatureTensor.min,
        normedFeatureTensor.max
      );
      const prediction = model.predict(normedInput.tensor);
      //denormalize
      const denormedPrediction = denormalize(
        prediction,
        normedFeatureTensor.min,
        normedFeatureTensor.max
      );
      const output = denormedPrediction.dataSync()[0];
      document.getElementById(
        "predict-output"
      ).innerHTML = `Predicted Price ($1,000) <br> <span stype="font-size: 2em"> 
                    ${parseFloat(output).toFixed(2)}</span>`;

      //visualize prediction line
      const [xs, ys] = tf.tidy(() => {
        const normedXs = tf.linspace(0, 1, 100);
        const normedYs = model.predict(normedXs.reshape([100, 1]));
        const denormedXs = denormalize(
          normedXs,
          normedFeatureTensor.min,
          normedFeatureTensor.max
        );
        const denormedYs = denormalize(
          normedYs,
          normedFeatureTensor.min,
          normedFeatureTensor.max
        );
        return [denormedXs.dataSync(), denormedYs.dataSync()];
      });
      const pointsLine = Array.from(xs).map((x, index) => ({
        x: x,
        y: ys[index]
      }));
      surface = { name: "Predict Line", tab: "Data" };
      data = { values: pointsLine, series: ["Predictions "] };
      opts = { xLabel: "Square Feet", yLabel: "Price" };
      tfvis.render.scatterplot(surface, data, opts);
    });
  }
}
