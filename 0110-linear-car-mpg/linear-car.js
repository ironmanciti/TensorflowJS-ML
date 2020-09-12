//carsData data 중 자동차 마력을 기준으로 연비 예측하는 Linear Model 작성
//Data load
async function getData() {
    const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');  
    const carsData = await carsDataReq.json();  
    const cleaned = carsData.map(car => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    }))
    .filter(car => (car.mpg != null && car.horsepower != null));
    return cleaned;
}

// data 를 tensor 로 convert 하고 shuffling, normalizingthe 
function convertToTensor(data) {
    
    return tf.tidy(() => {
      // Step 1. Shuffle the data   
      tf.util.shuffle(data);
  
      // Step 2. Convert data to Tensor
      const inputs = data.map(d => d.horsepower)
      const labels = data.map(d => d.mpg);
  
      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
  
      //Step 3. min-max scaling
      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();  
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();
  
      const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
      const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
  
      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        // evaluation 및 predict 단계에서 사용할 min, max data
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      }
    });  
}
  
// NN 모델 생성
function createModel() {

    const model = tf.sequential(); 
    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 1, useBias: true}));
    
    return model;
}   
// NN model compile and train
async function trainModel(model, inputs, labels) {
    // model compile 
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });
    
    const batchSize = 32;
    const epochs = 50;
    
    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      callbacks: tfvis.show.fitCallbacks(
        { name: 'Training Performance' },
        ['mse'], 
        { height: 200, callbacks: ['onEpochEnd'] }
      )
    });
}

function testModel(model, inputData, normalizationData) {
    // train 된 model test 를 위해 
    //inputData 중 10 개를 random selection
    const testData = inputData.sort(() => 0.5 - Math.random()).slice(0,10);
    const inputs = testData.map(d => d.horsepower)
    //tensor 변환
    const testX = tf.tensor2d(inputs, [inputs.length, 1]);

    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  

    // testX data normalize
    const [xs, preds] = tf.tidy(() => {
      const xs = testX.sub(inputMin).div(inputMax.sub(inputMin));
      //model prediction
      const preds = model.predict(xs);     
      //xs 를 원래의 testData scale 로 un-normalize
      const unNormXs = xs
        .mul(inputMax.sub(inputMin))
        .add(inputMin);
      //prediction 을 원래의 scale 로 un-normalize
      const unNormPreds = preds
        .mul(labelMax.sub(labelMin))
        .add(labelMin);
      
      return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
    
    // return 된 xs 는 Float32Array type 이므로 
    // Array.from() method 로 일반 array 전환 및 object 변환
    const predictedPoints = Array.from(xs).map((val, i) => {
      return {x: val, y: preds[i]}
    });
    
    const originalPoints = testData.map(d => ({
      x: d.horsepower, y: d.mpg,
    }));
    
    //시각화 하여 원래 input 의 label 과 prediction 비교
    tfvis.render.scatterplot(
      {name: 'Model Predictions vs Original Data'}, 
      {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 300
      }
    );
}

// main run 함수
async function run() {
    // data load
    const data = await getData();
    // horsepower -> x, mpg -> y 로 mapping
    const values = data.map(d => ({
      x: d.horsepower,
      y: d.mpg,
    }));
    //input data 분포 시각화
    tfvis.render.scatterplot(
      {name: 'Horsepower v MPG'},
      {values}, 
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 300
      }
    );
    
    //NN model 생성
    const model = createModel();  
    tfvis.show.modelSummary({name: 'Model Summary'}, model); 

    //data 를 tensor 로 변환
    const tensorData = convertToTensor(data);
    const {inputs, labels} = tensorData;
    
    // model train
    await trainModel(model, inputs, labels);
    console.log('Done Training');

    // train 된 model 평가
    testModel(model, data, tensorData);
    console.log('Done Test')
}

document.addEventListener('DOMContentLoaded', run);