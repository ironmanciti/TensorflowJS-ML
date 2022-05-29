import {MnistData} from "./data.js";
const EPOCHS = 10;

//model 정의 - tf.sequential layer API 를 이용하여 CNN 구축
function get_model() {
    
    return model;
}

async function train(model, data) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
       
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
        
    });
}

const classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function doPrediction(model, data, testDataSize = 500) {
    const testData = data.nextTestBatch(testDataSize);
    const testXs = testData.xs.reshape([testDataSize, 28, 28, 1]);


    return [preds, labels];
}

async function showAccuracy(model, data) {
    const [preds, labels] = doPrediction(model, data);
   
}

async function showConfusion(model, data) {
    const [preds, labels] = doPrediction(model, data);
    
}

async function run() {
    const data = new MnistData();
    await data.load();

    
}

document.addEventListener("DOMContentLoaded", run);
