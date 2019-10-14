// console.log('Hello TensorFlow');
/**
 * 자동차 연비 data 의 feature 중에서 horsepower 한개 feature 만을 이용하여 연비 측정 및
 * missing data filtering
 */

const TRAIN_TEST_SPLIT = 0.8

async function getData() {
    const carsreq = 
        await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
    let carsData = await carsreq.json();
    //연비와 마력만 select (null value 인 record 제외)
    carsData = carsData.map(x => ({
                mpg: x.Miles_per_Gallon,
                power: x.Horsepower
            }))
            .filter(x => (x.mpg != null && x.power != null));
    return carsData;
};

(async () => {
    const carsData = await getData();

    //step1 - data 내용 파악
    const values = carsData.map(d => ({
        x: d.power,
        y: d.mpg
    }))
    
    tfvis.render.scatterplot(
        {name: "마력 vs 연비"}, {values}
        );

    //step2 - shuffle data using lodash
    const shuffled = _.shuffle(carsData);

    //step3 - train/test data split
    const inputs = shuffled.map(d => d.power);
    const labels = shuffled.map(d => d.mpg);

    const train_size = Math.floor(inputs.length * TRAIN_TEST_SPLIT);
    const test_size = inputs.length - train_size;

    const X_train = inputs.slice(0, train_size);
    const y_train = labels.slice(0, train_size);
    const X_test  = inputs.slice(train_size);
    const y_test = labels.slice(train_size);

    console.log('train_size = ', train_size);
    console.log('test_size = ', test_size);
    
    
    //step4 - convert to tensor
    const ts = tf.tidy(() => {
        const Xs_train = tf.tensor2d(X_train, [train_size, 1]);
        const ys_train = tf.tensor2d(y_train, [train_size, 1]);
        const Xs_test = tf.tensor2d(X_test, [test_size, 1]);
        const ys_test = tf.tensor2d(y_test, [test_size, 1]);
    
        //step5 - Normalization (min-max scaling)
        const xMax = Xs_train.max();
        const xMin = Xs_train.min();
        const yMax = ys_train.max();
        const yMin = ys_train.min();
        
        const Xsn_train = Xs_train.sub(xMin).div(xMax.sub(xMin));
        const ysn_train = ys_train.sub(yMin).div(yMax.sub(yMin));
        const Xsn_test = Xs_test.sub(xMin).div(xMax.sub(xMin));
        const ysn_test = ys_test.sub(yMin).div(yMax.sub(yMin));

        return {Xsn_train, ysn_train, Xsn_test, ysn_test,
                xMax, xMin, yMax, yMin}
    });
    
    console.log('numTensors (outside tidy): ' + tf.memory().numTensors);
    console.log(ts);
    
    //step6 - model creation
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [1], units: 100, activation: 'relu'}));
    model.add(tf.layers.dense({units: 50, activation: 'relu'}))
    model.add(tf.layers.dense({units: 1}));
    model.compile({optimizer: tf.train.adam(), 
                   loss: tf.losses.meanSquaredError,
                   metrics: ['mse']});
    
    model.summary();
    tfvis.show.modelSummary({name: "Model Summary"}, model);

    //step7 - Train the model
    await model.fit(ts.Xsn_train, ts.ysn_train, {
        batchSize:28,
        epochs: 50,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
            {'name': 'Training Performance'},
            ['loss', 'mse'],
            {height: 200, callbacks: ['onEpochEnd']}
        )
    });

    //step8 - Validate the model using Test data & visualize
    const predictions = model.predict(ts.Xsn_test);

    // 원래의 data 와 비교하기 위해 y_pred 를 Un-normalize
    unNormalizedXs = ts.Xsn_test.mul(ts.xMax.sub(ts.xMin).add(ts.xMin));
    unNormedys = ts.ysn_test.mul(ts.yMax.sub(ts.yMin).add(ts.yMin));
    unNormedPredictions = predictions.mul(ts.yMax.sub(ts.yMin).add(ts.yMin));
    
    // visualization 을 위해 {x, y} tuple 로 만든다.
    const y_pred = Array.from(unNormalizedXs.dataSync()).map((val, i) => {
        return {x: val, y: unNormedPredictions.dataSync()[i]}
    }) 
    console.log(y_pred)
    const y_original = Array.from(unNormalizedXs.dataSync()).map((val, i) => {
        return {x: val, y: unNormedys.dataSync()[i]}
    }) 

    // visualize
    const surface = {name: '마력 vs 연비', tab: 'Prediction'}
    const data = {values: [y_pred, y_original], series: ['predicted', 'oroginal']}
    tfvis.render.scatterplot(surface, data);

})();


    
