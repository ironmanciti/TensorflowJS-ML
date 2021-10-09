//carsData data 중 자동차 마력을 기준으로 연비 예측하는 Linear Model 작성
//Data load
//Missing data cleansing - 갤런당 마일이나 마력이 정의되지 않은 항목 삭제
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

//data 를 tensor 로 convert 하고 shuffling, normalizing 
function convertToTensor(data) {
    return tf.tidy(() => {  //중간 텐서 모두 삭제
      // Step 1. data shuffling
      tf.util.shuffle(data);
  
      // Step 2. data 를 Tensor로 변환
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
        // 출력을 정규화하지 않은 원래의 상태로 다시 되돌려서 원래의 조정으로 가져오고 향후 입력 데이터를 
        // 동일한 방식으로 정규화할 수 있도록 학습 중에 정규화에 사용한 값을 유지
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      }
    });  
}
  
// NN 모델 생성
//input : 마력, output : 연비
function createModel() {
    const model = tf.sequential(); 
    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 1, useBias: true}));
    return model;
}   
// NN model compile and train
async function trainModel(model, inputs, labels) {
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

    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
    //0과 1 사이의 균일한 범위의 숫자에 대한 예측을 생성
    //이전에 수행한 min-max scale의 역을 수행하여 데이터를 비정규화
    const [xs, preds] = tf.tidy(() => {
      //test data 생성
      const xs = tf.linspace(0, 1, 100);
      //test data 예측
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
    
    const originalPoints = inputData.map(d => ({
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
    // 훈련할 원본 입력 데이터를 로드하고 플로팅
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
    
    //model train
    await trainModel(model, inputs, labels);
    console.log('Done Training');

    //model sets
    testModel(model, data, tensorData)
}

document.addEventListener('DOMContentLoaded', run);


