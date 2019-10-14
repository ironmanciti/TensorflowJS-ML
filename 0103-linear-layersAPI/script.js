//tensorflow.js Layers-API 이용

const X = Array(100).fill(0).map(x => Math.random() * 100 - Math.random() * 50);
const y = X.map(x => 2.5 * x + 5 + Math.random() * 50);

// y = 2.5 * X + 5 + noise
const trainData = {
    X: X,
    y: y
};

// Data 를 tensor 로 변환 : tf.tensor2d(array, shape)
trainXs = tf.tensor2d(trainData.X, [100, 1]);
trainYs = tf.tensor2d(trainData.y, [100, 1]);

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

    let zip = (arr1, arr2) => arr1.map((x, i) => { return {'x': x, 'y': arr2[i]}});
    const toy_data = zip(trainData.X, trainData.y);
    const prediction = trainData.X.map(x => ({'x':x, 'y':k*x+b}));
    
    tfvis.render.scatterplot(
        {name: 'Model Prediction vs. Original Data'},
        {values: [prediction, toy_data], series:['prediction', 'toy_data']}
    )
})();



  



