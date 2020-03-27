async function run() {
  const trainingUrl = "wdbc-train.csv";
  const testingUrl = "wdbc-test.csv";

  // 'wdbc-train.csv' 의 diagnosis column 을 label 로 지정
  //  diagnosis is malignant(악성) or benign(양성)
  const trainingData = tf.data.csv(trainingUrl, {
    columnConfigs: {
      diagnosis: { isLabel: true }
    }
  });

  const convertedTrainingData = trainingData
    .map(({ xs, ys }) => {
      return { xs: Object.values(xs), ys: Object.values(ys) };
    })
    .batch(30);

  console.log(await convertedTrainingData.toArray());

  const testingData = tf.data.csv(testingUrl, {
    columnConfigs: {
      diagnosis: { isLabel: true }
    }
  });

  const convertedTestingData = testingData
    .map(({ xs, ys }) => {
      return { xs: Object.values(xs), ys: Object.values(ys) };
    })
    .batch(30);

  console.log(await trainingData.columnNames());

  const numFeatures = (await trainingData.columnNames()).length - 1;
  console.log(numFeatures);

  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [numFeatures],
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
    optimizer: tf.train.rmsprop(0.01),
    metrics: ["accuracy"]
  });

  model.summary();

  const Epochs = 5;
  await model.fitDataset(convertedTrainingData, {
    epochs: Epochs,
    validationData: convertedTestingData,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(
          `Epochs: ${epoch}, Loss: ${logs.loss.toFixed(4)},`,
          `Accuracy: ${logs.acc.toFixed(4)}`
        );
      }
    }
  });

  await model.save("downloads://my_model");
}

document.addEventListener("DOMContentLoaded", run);
