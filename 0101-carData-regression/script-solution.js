//자동차 데이터를 관심 있는 변수로 줄이고 누락된 데이터를 제거합니다.
async function getData(){
    const carDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const carData = await carDataResponse.json();
    const cleaned = carData.map(car => ({
        x: car.Miles_per_Gallon,
        y: car.Horsepower,
    }))
    .filter(car => (car.x != null && car.y != null));
    return cleaned;
}

function createModel(){
    const model = tf.sequential()
    model.add(tf.layers.dense({inputShape: [1], units: 1}));
    model.add(tf.layers.dense({units: 16, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1}));
    return model;
}

/*
입력 데이터를 기계 학습에 사용할 수 있는 텐서로 변환합니다.
또한 데이터를 셔플링하고 MPG를 정규화 할 것입니다.
*/
function convertToTensor(data){
    return tf.tidy(() => {
        //step1. data shuffling
        tf.util.shuffle(data);

        //step2. 2D tensor 변환 : [num_examples, num_features_per_example]
        const inputs = data.map(d => d.x);
        const labels = data.map(d => d.y);

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        //step3. 0-1사이로 min-max scaling
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            inputMax, 
            inputMin, 
            labelMax, 
            labelMin
        }
    });
}

async function trainModel(model, inputs, labels){
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
            {name: 'Training Performance'}, 
            ['loss'],
            {height: 200, callbacks: ['onEpochEnd']}
        )
    });
}

function testModel(model, inputData, normalizationData){
    const {inputMax, inputMin, labelMax, labelMin} = normalizationData;

    //0-1사이로 가상의 input data 100개 생성하여 예측
    //학습 data와 동일한 [num_examples, num_features_per_example]로 생성
    const [xs, preds] = tf.tidy(() => {
        const xs = tf.linspace(0, 1, 100);
        const preds = model.predict(xs.reshape([100, 1]));
        const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin);
        const unNormPreds = preds 
            .mul(labelMax.sub(labelMin))
            .add(labelMin);
        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });

    const predictedPoints = Array.from(xs).map((val, i) => {
        return {x: val, 
                y: preds[i]}
    });

    const originalPoints = inputData.map(d => ({
        x: d.x, 
        y: d.y,
    }))

    tfvis.render.scatterplot(
        {name: "Model 예측값 vs Original Data"},
        {values: [originalPoints, predictedPoints], 
         series: ['original', 'predicted']},
        {
            XLabel: '마력',
            yLabel: '연비',
            height: 300
        }
    )
}

async function run(){
    //훈련할 원본 입력 데이터를 로드
    const data = await getData();
    
    //모델 생성 
    const model = createModel();
    tfvis.show.modelSummary({name: 'Model Summary'}, model);

    //훈련할 데이터 변환
    const tensorData = convertToTensor(data);
    const {inputs, labels} = tensorData;

    //model Train  
    await trainModel(model, inputs, labels);
    console.log('Train 완료');

    //예측 및 original data와 비교
    testModel(model, data, tensorData);
}

document.addEventListener('DOMContentLoaded', run);