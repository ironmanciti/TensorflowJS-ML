import {MnistData} from "./data.js";
const EPOCHS = 10;

//model 정의 - tf.sequential layer API 를 이용하여 CNN 구축
function get_model() {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: 10,
        kernelInitializer: 'varianceScaling',
        activation: 'softmax'
    }));
    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    return model;
}

async function train(model, data) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
        name: 'Model Training', tab: 'Model', styles: {height: '1000px'}
    };
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

    const BATCH_SIZE = 512;
    const TRAIN_SIZE = 5500;
    const TEST_SIZE = 1000;
    const EPOCHS = 10;

    //data 불러오기
    const [trainXs, trainYs] = tf.tidy(() => {
        const d = data.nextTrainBatch(TRAIN_SIZE);
        return [d.xs.reshape([TRAIN_SIZE, 28, 28, 1]), d.labels];
    });

    const [testXs, testYs] = tf.tidy(() => {
        const d = data.nextTestBatch(TEST_SIZE);
        return [d.xs.reshape([TEST_SIZE, 28, 28, 1]), d.labels];
    });
    
    //model train 및 시각화
    return model.fit(trainXs, trainYs, {
        batchSize: BATCH_SIZE,
        validationData: [testXs, testYs],
        epochs: EPOCHS,
        shuffle: true,
        callbacks: fitCallbacks
    });
}

const classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function doPrediction(model, data, testDataSize = 500) {
    const testData = data.nextTestBatch(testDataSize);
    const testXs = testData.xs.reshape([testDataSize, 28, 28, 1]);

    const labels = testData.labels.argMax(-1);
    const preds = model.predict(testXs).argMax(-1);

    testXs.dispose();
    return [preds, labels];
}

async function showAccuracy(model, data) {
    const [preds, labels] = doPrediction(model, data);
    const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
    const container = {name: 'Accuracy', tab: 'Evaluation'};
    await tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

    preds.dispose();
    labels.dispose();
}

async function showConfusion(model, data) {
    const [preds, labels] = doPrediction(model, data);
    const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
    const container = {name: 'Confusion Matrix', tab: 'Evaluation'};
    await tfvis.render.confusionMatrix(container, {values: confusionMatrix, tickLabels: classNames});
    
    preds.dispose();
    labels.dispose();
}

async function run() {
    const data = new MnistData();
    await data.load();

    const model = get_model();
    tfvis.show.modelSummary({name: 'Model Summary', tab: 'Model'}, model);

    await train(model, data);
    await model.save('indexeddb://my-model-1');

    await showAccuracy(model, data);
    await showConfusion(model, data);
}

document.addEventListener("DOMContentLoaded", run);
