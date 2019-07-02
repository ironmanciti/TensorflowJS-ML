//console.log('Hello TensorFlow');

import {MnistData} from './data.js';

async function showExamples(data) {
  // visor 내의 container 생성
  const surface =
    tfvis.visor().surface({ name: 'Input Data Examples', tab: 'Input Data'});  

  // 20 개의 test image 
  const examples = data.nextTestBatch(20);    //examples.xs - tensor2d (20x784)
  const numExamples = examples.xs.shape[0];   //20  
  
  // example 을 rendering 할 canvas element 생성
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      // Reshape the image to 28x28x1 
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])   //slice([i,0], [1x784])
        .reshape([28, 28, 1]); 
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = 'margin: 4px;';
    await tf.browser.toPixels(imageTensor, canvas);
    surface.drawArea.appendChild(canvas);

    imageTensor.dispose();  //Disposes imageTensor
  }
}

function getModel() {
    const model = tf.sequential();

    const IMAGE_WIDTH = 28;
    const IMAGE_HEIGHT = 28;
    const IMAGE_CHANNELS = 1;  

    //CNN model define
    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'   //truncated normal distribution
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    model.add(tf.layers.flatten());

    // output classes (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    const NUM_OUTPUT_CLASSES = 10;
    model.add(tf.layers.dense({
        units: NUM_OUTPUT_CLASSES,
        kernelInitializer: 'varianceScaling',
        activation: 'softmax'
    }));

    // model compile
    const optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
}

// model train
async function train(model, data) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
      name: 'Model Training', styles: { height: '1000px' }
    };
    // batch, epoch 마다 호출할 callback 함수
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
    
    const BATCH_SIZE = 512;
    const TRAIN_DATA_SIZE = 5500;  // test 후 55000 으로 키워서 train
    const TEST_DATA_SIZE = 1000;   // test 후 10000 으로 키움
  
    // CNN 의 input shape - [num_examples, image_width, image_height, channels]
    const [trainXs, trainYs] = tf.tidy(() => {
      const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
      return [
        d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
        d.labels
      ];
    });
  
    const [testXs, testYs] = tf.tidy(() => {
      const d = data.nextTestBatch(TEST_DATA_SIZE);  // d = {xs, labels}
      return [
        d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),  //d.xs - tensor2d (-1x784)
        d.labels
      ];
    });
  
    return model.fit(trainXs, trainYs, {
      batchSize: BATCH_SIZE,
      validationData: [testXs, testYs],
      epochs: 10,
      shuffle: true,
      callbacks: fitCallbacks
    });
}
   
async function run() {  
  const data = new MnistData();
  await data.load();
  await showExamples(data);

  const model = getModel();
  tfvis.show.modelSummary({name: 'Model Architecture'}, model);
    
  await train(model, data);

  await showAccuracy(model, data);
  await showConfusion(model, data);
}

document.addEventListener('DOMContentLoaded', run);

const classNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function doPrediction(model, data, testDataSize = 500) {
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const testData = data.nextTestBatch(testDataSize);
  //testData.xs - shape [500, 784]
  //testData.label - shape [500, 10]
  const testxs = testData.xs.reshape([testDataSize, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
  //testxs shape [500, 28, 28, 1]
  const labels = testData.labels.argMax(1);        //last axis
  const preds = model.predict(testxs).argMax(1);   //last axis

  //   [[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  //    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //    ...,
  //    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  //    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]]
  
  //    [8, 0, 4, ..., 9, 4, 8]

  testxs.dispose();
  return [preds, labels];
}

//multiclass 의 class 별 accuracy 시각화
async function showAccuracy(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = {name: 'Accuracy', tab: 'Evaluation'};
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

  labels.dispose();
}

// confusion matrix 시각화
async function showConfusion(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = {name: 'Confusion Matrix', tab: 'Evaluation'};
  tfvis.render.confusionMatrix(
      container, {values: confusionMatrix}, classNames);

  labels.dispose();
}
