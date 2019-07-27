import 'bootstrap/dist/css/bootstrap.css';
import * as tf from '@tensorflow/tfjs';
const _ = require('lodash');
  
const EPOCHS = 100;
let normedFeatures = [];
let normedFearureTensors;
let X_train, X_test, y_train, y_test, model;
let labelNames = ['setosa', 'versicolor', 'virginica'];

async function run() {
    const iris = await (await fetch('./iris.json')).json();
    let points = iris.map(record => ({
        x1: record.sepal_length,
        x2: record.sepal_width,
        x3: record.petal_length,
        x4: record.petal_width,
        c: record.species,
    }))
    //shuffling data
    points = _.shuffle(points);
    //plot(points);
    //category 변수 처리
    points.map(p => {
        if (p.c === 'setosa'){
            p.c = 0;
        } else if (p.c === 'versicolor'){
            p.c = 1;
        } else if (p.c === 'virginica'){
            p.c = 2;
        }
    })

    // feature extraction 
    const features = [];
    features.push(points.map(p => p.x1));
    features.push(points.map(p => p.x2));
    features.push(points.map(p => p.x3));
    features.push(points.map(p => p.x4));

    const labels = points.map(p => p.c);
    
    // Normalize
    const featureValues = [];
    for (let i = 0; i < features.length; i++){
        normedFeatures.push(normalize(features[i]));
        featureValues.push(normedFeatures[i].values);
    }

    // tensor 변환
    let tempTensors = tf.tensor2d(featureValues, [featureValues.length, featureValues[0].length]);

    normedFearureTensors = tf.transpose(tempTensors); 

    // One-Hot encoding of labelTensor
    const labelTensor = tf.oneHot(tf.tensor1d(labels, "int32"), 3);

    tempTensors.dispose();

    // train / test set split
    const trainLen = Math.floor(normedFearureTensors.shape[0] * 0.75);
    const testLen = normedFearureTensors.shape[0] - trainLen;
    [X_train, X_test] = tf.split(normedFearureTensors, [trainLen, testLen]);
    [y_train, y_test] = tf.split(labelTensor, [trainLen, testLen]);


    
const prediction = predict(X_test);
prediction.argMax(1).dataSync();

const accuracy = prediction.equal(y_test);
console.log(accuracy.sum().get() / accuracy.shape[0] * 100);
}
async function train(){
    const numIterations = 100;
    const learningRate = 0.0001;
    const optimizer = tf.train.sgd(learningRate);
    const number_of_classes = Array.from(new Set(y_train));
    
    const w = tf.variable(tf.zeros([3, number_of_classes]));
    const b = tf.variable(tf.zeros([number_of_classes]));

    for (let i = 0; u < numIterations; i++){
        optimizer.minimize(() => {
            const loss_val = loss(predict(X_train), y_train);
            return loss_val;
        })
    }
    
}

function predict(x){
    return tf.tidy(() => {
        return tf.softmax(tf.add(tf.matMul(x, w), b));
    })
}

function loss(prediction, labels){
    const y = tf.oneHot(labels.toInt(), number_of_classes);
    const entropy = tf.mean(tf.sub(tf.scalar(1), tf.sum(tf.mul(y.toFloat(), tf.log(predictions), 1))));
    return entropy;
}

run();



