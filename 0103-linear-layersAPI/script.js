//tensorflow.js Layers-API 이용

const trainData = {
X:  [0.080, 9.000, 0.001, 0.100, 8.000, 5.000, 0.100, 6.000, 0.050, 0.500,
            0.002, 2.000, 0.005, 10.00, 0.010, 7.000, 6.000, 5.000, 1.000, 1.000],
y: [0.135, 0.739, 0.067, 0.126, 0.646, 0.435, 0.069, 0.497, 0.068, 0.116,
            0.070, 0.289, 0.076, 0.744, 0.083, 0.560, 0.480, 0.399, 0.153, 0.149]
};

let zip = (arr1, arr2) => arr1.map((x, i) => { return {'x': x, 'y': arr2[i]}});
const toy_data = zip(trainData.X, trainData.y);

// Data 를 tensor 로 변환 : tf.tensor2d(array, shape)
trainXs = tf.tensor2d(trainData.X, [20, 1]);
trainYs = tf.tensor2d(trainData.y, [20, 1]);

// simple Linear Regression model : y = wX + b
// no hidden layer
const model = tf.sequential();
model.add(tf.layers.dense({inputShape: [1], units: 1}));

const optimizer = tf.train.sgd(0.0005);
model.compile({optimizer: optimizer, loss: 'meanSquaredError'});

// model train 하며 Train Performance display
(async () => {
    await model.fit(trainXs, trainYs, {
        epochs: 200,
        callbacks: tfvis.show.fitCallbacks(
            {name: 'Training Performance'},
            ['loss', 'mse'],
            {height: 200, callbacks: ['onEpochEnd']}
        )
    });

    // train 완료 후 기울기와 절편을 구하여 시각화
    const k = model.getWeights()[0].dataSync()[0];
    const b = model.getWeights()[1].dataSync()[0];

    console.log(k, b);

    const prediction = trainData.X.map(x => ({'x':x, 'y':k*x+b}));
    
    tfvis.render.scatterplot(
        {name: 'Model Prediction vs. Original Data'},
        {values: [prediction, toy_data], series:['prediction', 'toy_data']}
    )
})();



  



