import {MnistData} from './mnistData.js';

//sample data 를 visor 상에 plot
async function showExamples(data){
    const surface = tfvis.visor().surface({name: 'Data Sample', tab: 'Input Data'});

    //25 개 sample 을 minstData.js 에서 가져오기
    const examples = data.nextTestBatch(25);
    const numExamples = examples.xs.shape[0];
    const exampleSize = examples.xs.shape[1];
    
    //각 sample 을 rendering 할 canvas element 생성
    for (let i = 0; i < numExamples; i++){
        const [imageTensor, labels] = tf.tidy(() => {
            // 1x784 인 examples.xs 를 28x28 로 reshape
            // slice(begin, size) & reshape
            return [examples.xs
                    .slice([i,0], [1, exampleSize])
                    .reshape([28, 28, 1]), examples.labels];
        });
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        canvas.style = 'margin: 4px;'

        await tf.browser.toPixels(imageTensor, canvas); //tensor --> pixel

        surface.drawArea.appendChild(canvas);   
  
        imageTensor.dispose();
    }
}

//model 정의 - tf.sequential layer API 를 이용하여 CNN 구축
function modelBuild(){
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        strides: 1, 
        activation: 'relu',
        kernelInitializer: 'varianceScaling'  // same as He initializer for relu
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2,2],
        strides: [2,2]
    }));
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1, 
        activation: 'relu',
        kernelInitializer: 'varianceScaling'  
    }));
    model.add(tf.layers.maxPooling2d({
        poolSize: [2,2],
        strides: [2,2]
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: 10,
        kernelInitializer: 'varianceScaling',
        activation: 'softmax'
    }))

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    //model.summary();

    return model;
}

async function train(model, data){
    //history plot 할 monitoring metrics
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
        name: 'Model Training', style: {height: '1000px'}
    }
    //callback instance
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
    
    const BATCH_SIZE = 512;
    const TRAIN_DATA_SIZE = 55000;
    const TEST_DATA_SIZE = 10000;
    // training data 불러오기
    const [trainXs, trainYs] = tf.tidy(() => {
        const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
        return [d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]), d.labels];
    });
    // validation data 불러오기
    const [testXs, testYs] = tf.tidy(() => {
        const d = data.nextTestBatch(TEST_DATA_SIZE);
        return [d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]), d.labels];
    });
    // training & history plotting
    return model.fit(trainXs, trainYs, {
        batchSize: BATCH_SIZE,
        validationData: [testXs, testYs],
        epochs: 15,
        shuffle: true,
        callbacks: fitCallbacks
    })
}

function doPrediction(model, data, testDataSize = 500){
    const testData = data.nextTestBatch(testDataSize);
    const testXs = testData.xs.reshape([testDataSize, 28, 28, 1])
    const labels = testData.labels.argMax(1);
    const preds = model.predict(testXs).argMax(1);
    testXs.dispose()
    return [preds, labels];
}

async function showAccuracy(model, data){
    const [preds, labels] = doPrediction(model, data);
    const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
    const container = {name: 'Accuracy', tab: 'Evaluation'};
    preds.dispose();
    labels.dispose();
    return tfvis.show.perClassAccuracy(container, classAccuracy);
}

async function showConfusion(model, data){
    const [preds, labels] = doPrediction(model, data);
    const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
    const container = {name: 'Confusion Matrix', tab: 'Evaluation'};
    preds.dispose();
    labels.dispose();
    return tfvis.render.confusionMatrix(container, {values: confusionMatrix});
}

(async function run(){
    const data = new MnistData();
    await data.load();
    await showExamples(data);

    const model = modelBuild();
    await tfvis.show.modelSummary({name: 'Model Architecture', tab:'Model Summary'}, model);
    
    await train(model, data); 
    //evaluation
    await showAccuracy(model, data);
    await showConfusion(model, data);
})();
