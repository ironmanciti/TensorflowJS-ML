// JSON 형식의 자동차 데이터를 가져온 후, 마력과 연비 정보만 추출하고 null 데이터를 제거
async function getData(){
    const carDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const carData = await carDataResponse.json();
    const cleaned = carData.map(car => ({
        mpg: car.Miles_per_Gallon,
        horsepower: car.Horsepower,
    }))
    .filter(car => (car.mpg != null && car.horsepower != null));
    return cleaned;
}
// 머신러닝 모델을 생성. 1개의 입력 레이어와 1개의 출력 레이어를 가진 모델을 생성.
function createModel(){
    const model = tf.sequential()
    model.add(tf.layers.dense({inputShape: [1], units: 3, activation: 'relu'}));
    // model.add(tf.layers.dense({units: 16, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1}));
    return model;
}

// JSON 형식의 데이터를 텐서로 변환하고, 데이터를 정규화하며, 정규화에 사용된 최소/최대값을 반환
function convertToTensor(data){
    return tf.tidy(() => {
        //step1. 데이터 셔플링
        tf.util.shuffle(data);

        //step2. 데이터를 2D tensor로 변환 : [num_examples, num_features_per_example]
        const inputs = data.map(d => d.horsepower);
        const labels = data.map(d => d.mpg);

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        //step3. 0-1사이로 min-max scaling (데이터 정규화)
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            //denormalize 때 사용하기 위해 min/max를 함께 반환
            inputMax, 
            inputMin, 
            labelMax, 
            labelMin
        }
    });
}

// 머신러닝 모델을 학습시키는 함수
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

// 학습된 머신러닝 모델로 예측을 수행하고, 원본 데이터와 예측 결과를 시각화
function testModel(model, inputData, normalizationData){
    const {inputMax, inputMin, labelMax, labelMin} = normalizationData;

    //0-1사이로 가상의 input data 100개 생성하여 예측
    //학습 data와 동일한 [num_examples, num_features_per_example]로 생성
    const [xs, preds] = tf.tidy(() => {
        const xs = tf.linspace(0, 1, 100);  //test data
        const preds = model.predict(xs.reshape([100, 1]));

        const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin);

        const unNormPreds = preds 
            .mul(labelMax.sub(labelMin))
            .add(labelMin);
        //data를 un-normalize
        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });

    const predictedPoints = Array.from(xs).map((val, i) => {
        return {x: val, y: preds[i]}
    });

    const originalPoints = inputData.map(d => ({
        x: d.horsepower, y: d.mpg,
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

// 위의 모든 과정을 순차적으로 실행
async function run(){
    //훈련할 원본 입력 데이터를 로드
    const data = await getData();
    const values = data.map(d => ({
        x: d.horsepower,
        y: d.mpg,
    }));

    tfvis.render.scatterplot(
        {name: '마력 대 연비'},
        {values,
        series: ['original data']},
        {
            xLabel: '마력',
            yLabel: '연비',
            height: 300
        }
    )
    //모델 생성 
    const model = createModel();
    tfvis.show.modelSummary({name: 'Model Summary'}, model);

    //훈련할 데이터 변환
    const tensorData = convertToTensor(data);
    const {inputs, labels} = tensorData;
    // inputs.print(); labels.print();

    //model Train  
    await trainModel(model, inputs, labels);
    console.log('Train 완료');

    //예측 및 original data와 비교
    testModel(model, data, tensorData);
}

// 페이지 로드가 완료되면 run 함수를 실행
document.addEventListener('DOMContentLoaded', run);