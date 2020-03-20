const tf = require('@tensorflow/tfjs-node');

const data = require('./data');
const model = require('./model');

async function run(){
    // mnist data loading
    await data.loadData();

    const {images: trainImages, labels: trainLabels} = data.getTrainData();
    
    model.summary();
    // train using data
    await model.fit(trainImages, trainLabels, {
        epochs: 1,
        batchSize: 128,
        validationSplit: 0.15,
        verbose: 1
    })

    //model evaluation
    const {images: testImages, labels: testLabels} = data.getTestData();
    const evalOutput = model.evaluate(testImages, testLabels);
    console.log(`\nEvaluation result:` + 
                `   Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; ` +
                `Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}`);

    //model save
    await model.save('file://mnist_node_model_save');
};

run();