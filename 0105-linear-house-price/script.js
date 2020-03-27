const EPOCH = 10;
const HouseSalesDataset = tf.data.csv("kc_house_data.csv", {
  columnConfigs: {
    sqft_living: { isLabel: false },
    price: { isLabel: true }
  },
  configuredColumnsOnly: true
});

async function run() {
  //csv 파일 읽기
  console.log("CSV file = ");
  console.log(await HouseSalesDataset.take(10).toArray());

  //시각화
  const dataPoints = await HouseSalesDataset.map(({ xs, ys }) => ({
    x: Object.values(xs),
    y: Object.values(ys)
  })).toArray();

  let surface = { name: "면적 vs 가격", tab: "Data" };
  let data = { values: [dataPoints], series: ["true value"] };
  let opts = { xLabel: "면적", yLabel: "가격" };
  tfvis.render.scatterplot(surface, data, opts);

  //feature, label 값의 JS array 변환
  const featureValues = dataPoints.map(p => p.x);
  const labelValues = dataPoints.map(p => p.y);

  //JS array 를 tensor 변환
  const featureTensor = tf.tensor2d(featureValues, [
    featureValues.length,
    featureValues[0].length
  ]);
  const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

  // data normalization
  function minMaxScaling(tensor) {
    const min = tensor.min();
    const max = tensor.max();
    const normedTensor = tensor.sub(min).div(max.sub(min));
    return { tensor: normedTensor, min, max };
  }

  function denormalize(tensor, min, max) {
    return tensor.mul(max.sub(min)).add(min);
  }

  const normedFeatureTensor = minMaxScaling(featureTensor);
  const normedLabelTensor = minMaxScaling(labelTensor);

  // 불필요한 tensor 를 memory 에서 삭제
  featureTensor.dispose();
  labelTensor.dispose();

  //normalized data 시각화
  const normedDataPoints = [];
  const normedFeatureArr = normedFeatureTensor.tensor.arraySync();
  const normedLabelArr = normedLabelTensor.tensor.arraySync();
  for (let i = 0; i < normedFeatureArr.length; i++) {
    normedDataPoints.push({ x: normedFeatureArr[i], y: normedLabelArr[i] });
  }
  surface = { name: "normed data 시각화", tab: "Data" };
  data = { values: [normedDataPoints], series: ["true value"] };
  opts = { xLabel: "면적", yLabel: "가격" };
  tfvis.render.scatterplot(surface, data, opts);

  //train/test set split
  const trainSize = Math.floor(normedFeatureTensor.tensor.shape[0] * 0.75);
  const testSize = normedFeatureTensor.tensor.shape[0] - trainSize;
  console.log(normedFeatureTensor.tensor.shape, trainSize, testSize);

  const [X_train, X_test] = tf.split(normedFeatureTensor.tensor, [
    trainSize,
    testSize
  ]);
  const [y_train, y_test] = tf.split(normedLabelTensor.tensor, [
    trainSize,
    testSize
  ]);

  //model build
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 1,
      inputShape: [1],
      activation: "relu"
    })
  );

  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.sgd(0.1)
  });

  model.summary();
  //model summary 시각화
  tfvis.show.modelSummary({ name: "model summary", tab: "model" }, model);

  //train 진행 상황 시각화
  const EPOCHS = 2;
  const container = { name: "Training Performance", tab: "history" };
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
    // callbacks: {onEpochEnd: (epoch, log) => {
    //     console.log(`Epoch ${epoch}: loss=${log.loss.toFixed(4)}, val_loss=${log.val_loss.toFixed(4)}`) }}
  });

  //model evaluation to check overfitting
  const lossTensor = await model.evaluate(X_test, y_test).dataSync();
  console.log(`Test set Loss : ${parseFloat(lossTensor).toFixed(4)}`);

  //prediction
  const predictions = model.predict(X_test).dataSync();

  const predictedDataPoints = [];

  const X_testArr = X_test.arraySync();
  // console.log(predictions)

  for (let i = 0; i < predictions.length; i++) {
    predictedDataPoints.push({ x: X_testArr[i], y: predictions[i] });
  }

  //predicted data 시각화
  surface = { name: "predicted data 시각화", tab: "Data" };
  data = {
    values: [normedDataPoints, predictedDataPoints],
    series: ["true value", "predicted value"]
  };
  opts = { xLabel: "면적", yLabel: "가격" };
  tfvis.render.scatterplot(surface, data, opts);
}

document.addEventListener("DOMContentLoaded", run);
