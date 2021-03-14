import {MnistData} from "./mnistData.js";
const EPOCHS = 5;

//model 정의 - tf.sequential layer API 를 이용하여 CNN 구축
function model_build(){
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 6,
        strides: 1,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: 120,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 80,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 10,
        activation: 'softmax'
    }));
    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    return model;
}

async function train(model, data){
    const BATCH_SIZE = 512;
    const TRAIN_SIZE = 55000;
    const TEST_SIZE  = 10000;
    //data 불러오기
    const [X_train, y_train] = tf.tidy(() => {
        const d = data.nextTrainBatch(TRAIN_SIZE);
        return [d.xs.reshape([TRAIN_SIZE, 28, 28, 1]), d.labels];
    });
    const [X_test, y_test] = tf.tidy(() => {
        const d = data.nextTestBatch(TEST_SIZE);
        return [d.xs.reshape([TEST_SIZE, 28, 28, 1]), d.labels];
    });

    const surface = {name: 'history', tab: 'training'};
    const history = [];
    console.log("EPOCHS:", EPOCHS);
    await model.fit(X_train, y_train, {
        batchSize: BATCH_SIZE,
        validationData: [X_test, y_test],
        epochs: EPOCHS,
        callbacks: {
            onBatchEnd: (epoch, log) => {
                history.push(log);
                tfvis.show.history(surface, history,
                    ['loss', 'acc']);
            }
        }
    })
}

async function showAccuracy(labels, preds){
    const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
    const surface = {name: 'Accuracy', tab: 'Evaluation'}
    await tfvis.show.perClassAccuracy(surface, classAccuracy);
}

async function showConfusion(labels, preds){
    const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
    const surface = {name: 'Confusion Matrix', tab: 'Evaluation'}
    await tfvis.render.confusionMatrix(surface, { values: confusionMatrix});
}

async function run(){
    const data = new MnistData();
    await data.load();

    const model = model_build();
    await tfvis.show.modelSummary({
        name: 'Model Summary',
        tab: 'Model'
    }, model);

    await train(model, data);
    await model.save('indexeddb://my-model-1');

    //Evaluation
    const testSize = 100;
    const testData = data.nextTestBatch(testSize);
    const testXs = testData.xs.reshape([testSize, 28, 28, 1]);
    const labels = testData.labels.argMax(1);
    const preds = model.predict(testXs).argMax(1);

    testXs.dispose();

    await showAccuracy(labels, preds);
    await showConfusion(labels, preds);

    labels.dispose();
    preds.dispose();
}

document.addEventListener("DOMContentLoaded", run);
