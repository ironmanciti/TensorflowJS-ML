const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const loadCSV = require('../utils/load-csv');
const path = require('path');

let {features, labels} = loadCSV(path.join(__dirname, 'kc_house_data.csv'), {
    dataColumns: ['sqft_living'],
    labelColumns: ['price']
})

const featureTensors = tf.tensor2d(features, [features.length, 1]);
const labelTensors = tf.tensor2d(labels, [labels.length, 1]);

// min-max scaling 함수
function normalize(tensor) {
    const min = tensor.min();
    const max = tensor.max();
    const normedTensor = tensor.sub(min).div(max.sub(min));
    return {
        tensor : normedTensor,
        min,
        max
    }
}
// denormalization of min-max scaling 
function denormalize(tensor, min, max){
    return denormedTensor = tensor.mul(max.sub(min)).add(min);
}
// normalized fearue & label
const normedFeatureTensor = normalize(featureTensors);
const normedLabelTensor = normalize(labelTensors);
debugger;
// train / test set split
const trainLen = Math.floor(normedFeatureTensor.tensor.shape[0] * 0.75);
const testLen = normedFeatureTensor.tensor.shape[0] - trainLen;
const [X_train, X_test] = tf.split(normedFeatureTensor.tensor, [trainLen, testLen]);
const [y_train, y_test] = tf.split(normedLabelTensor.tensor, [trainLen, testLen]);
//X_train.print(true);

//train simple model
const model = tf.sequential();
model.add(tf.layers.dense({
    units: 100, 
    activation: 'relu',
    inputShape: [1]
}));
model.add(tf.layers.dense({
    units: 1,
    activation: "linear"
}));
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
model.summary();
debbuger;
model.fit(X_train, y_train, {
    epochs: 3,
    callbacks: {
        onEpochEnd: (epoch, log) => console.log(`Epoch= ${epoch}, Loss= ${log.loss}`)
    }
}).then((history) => {
    const result = model.evaluate(X_test, y_test);
    console.log(`Test set loss : ${parseFloat(result.dataSync()).toFixed(5)}`);
})


 