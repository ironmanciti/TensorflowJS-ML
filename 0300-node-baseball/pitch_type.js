import { pitchData } from './data.js';

const NUM_PITCH_CLASSES = 7;

async function run(){
    const data = new pitchData();
    await data.load();

    //Normalization 반영한 train, validation, test set 작성
    let isTrain = true;
    const trainingData = data.normedData(isTrain);

    // Load all test data in one batch to use for evaluation
    isTrain = false;
    const testData = data.normedData(isTrain);

    //console.log((await testData.toArray())[0].xs.toString());

    const model = tf.sequential();
    model.add(tf.layers.dense({units: 250, activation: 'relu', inputShape: [8]}));
    model.add(tf.layers.dense({units: 175, activation: 'relu'}));
    model.add(tf.layers.dense({units: 150, activation:'relu'}));
    model.add(tf.layers.dense({units: NUM_PITCH_CLASSES, activation: 'softmax'}));

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy']
    })

    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
        name: 'Model Training', style: { height: '1000px' }
    }
    //callback instance
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

    await model.fitDataset(trainingData, {
        epochs: 100,
        callbacks: fitCallbacks
        // callbacks: {
        //     onEpochEnd: async (epoch, logs) => {
        //         console.log(epoch + ':' + logs.loss);
        //     }
        // }
    });

    let preds, labels;
    await testData.forEachAsync(batch => {
        preds = model.predict(batch.xs).argMax(1).dataSync();
        labels = batch.ys.dataSync();
    });
    labels = tf.tensor1d(labels);
    preds = tf.tensor1d(preds);
    const container2 = { name: 'Accuracy', tab: 'Evaluation' };
    const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
    tfvis.show.perClassAccuracy(container2, classAccuracy);
}

run()
