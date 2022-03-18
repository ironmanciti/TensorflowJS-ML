import {
    MnistData
} from "./mnistData.js";
const EPOCHS = 10;

//model 정의 - tf.sequential layer API 를 이용하여 CNN 구축
function get_model() {
    
}

async function train(model, data) {
    const BATCH_SIZE = 512;
    const TRAIN_SIZE = 5500;
    const TEST_SIZE = 1000;
    //data 불러오기
    const [X_train, y_train] = tf.tidy(() => {
        const d = data.nextTrainBatch(TRAIN_SIZE);
        return [d.xs.reshape([TRAIN_SIZE, 28, 28, 1]), d.labels];
    });
    const [X_test, y_test] = tf.tidy(() => {
        const d = data.nextTestBatch(TEST_SIZE);
        return [d.xs.reshape([TEST_SIZE, 28, 28, 1]), d.labels];
    });

    //model train 및 시각화
    
}

const classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function doPrediction(model, data, testDataSize = 500) {
    
}

async function showAccuracy(model, data) {
    
}

async function showConfusion(model, data) {
    
}

async function run() {
    
}

document.addEventListener("DOMContentLoaded", run);
