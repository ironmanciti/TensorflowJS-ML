//console.log('Hello TensorFlow');
/**
 * 자동차 연비 data 의 feature 중에서 horsepower 한개 feature 만을 이용하여 연비 측정 및
 * missing data filtering
 */
async function getData() {
    const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');  
    console.log(carsDataReq);
    
    const carsData = await carsDataReq.json();  
    const cleaned = carsData.map(car => ({
      mpg: car.Miles_per_Gallon,      //target
      horsepower: car.Horsepower,     //feature
    }))
    .filter(car => (car.mpg != null && car.horsepower != null));  //missing data
    
    return cleaned;
  }

  function createModel() {
    // sequential model 생성
    const model = tf.sequential(); 
    
    // 1 hidden layer 의 shallow network 구성
    model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    
    // output layer (linear regression)
    model.add(tf.layers.dense({units: 1, useBias: true}));
  
    return model;
  }

/**
 * 1. input data 는 integer 이므로 tensor 형태로 바꾸어 준다. 
 * 2. training data 는 shuffling 해 주는 것이 best practice 이다.
 * 3. data normalization
 * 4. MPG target (label) value 로 한다. (y-axis)
 */
function convertToTensor(data) {
    // 중간에 생성된 tensor 들을 memory 에서 clear 하기 위해 tf.tidy() 로 wrapping
    
    return tf.tidy(() => {
      // Step 1. Shuffle the data    
      tf.util.shuffle(data);
  
      // Step 2. Convert data to Tensor
      const inputs = data.map(d => d.horsepower)
      const labels = data.map(d => d.mpg);
  
      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
  
      //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();  
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();
  
      const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
      const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
  
      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        // normalize 한 data 를 원래 값으로 복원하기 위해 mix/max 값 함께 반환
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      }
    });  
  }

  async function trainModel(model, inputs, labels) {
    // optimizer 와 loss function 지정  
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });
    
    const batchSize = 28;
    const epochs = 50;
    
    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      callbacks: tfvis.show.fitCallbacks(
        { name: 'Training Performance' },
        ['loss', 'mse'], 
        { height: 200, callbacks: ['onEpochEnd'] }
      )
    });
  }

  function testModel(model, inputData, normalizationData) {
    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
    
    // 0 과 1 사이의 test 값에 대하여 prediction 을 구하고,
    // min-max scaling 을 역으로 수행하여 원래의 값을 구한다.
    const [xs, preds] = tf.tidy(() => {
      
      const xs = tf.linspace(0, 1, 100);   //0~1 사이를 100 개로 분할   
      const preds = model.predict(xs.reshape([100, 1])); //prediction     
      
      const unNormXs = xs                  //un-normalize
        .mul(inputMax.sub(inputMin))
        .add(inputMin);
      
      const unNormPreds = preds            //un-normalize
        .mul(labelMax.sub(labelMin))
        .add(labelMin);
      
      // Un-normalize the data
      return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
    
   
    const predictedPoints = Array.from(xs).map((val, i) => {
      return {x: val, y: preds[i]}
    });
    
    const originalPoints = inputData.map(d => ({
      x: d.horsepower, y: d.mpg,
    }));
    
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

  async function run() {
    // original input data loading 및 시각화
    const data = await getData();
    const values = data.map(d => ({
      x: d.horsepower,
      y: d.mpg,
    }));
  
    tfvis.render.scatterplot(
      {name: 'Horsepower v MPG'},
      {values}, 
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 300
      }
    );
  
    // Create the model
    const model = createModel();  
    tfvis.show.modelSummary({name: 'Model Summary'}, model);

    // input data 를 tensor 형태로 변환
    const tensorData = convertToTensor(data);
    const {inputs, labels} = tensorData;
        
    // Train the model  
    await trainModel(model, inputs, labels);
    console.log('Done Training');

    // 훈련시킨 model 을 이용하여 prediction 하고 original data 와 비교
    testModel(model, data, tensorData);
  }
  
  document.addEventListener('DOMContentLoaded', run);

  