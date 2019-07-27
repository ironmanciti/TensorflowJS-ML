import 'bootstrap/dist/css/bootstrap.css';
import * as tf from '@tensorflow/tfjs';
document.getElementById('hello').innerText = "Hello";

const xtrain = tf.linspace(0,100,100);
const ytrain = xtrain.mul(2).add(10);

const m = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));

function predict(x){
    return tf.tidy(() => {
        return m.mul(x).add(b);
    })
}

function loss(predictions, labels){
    return tf.tidy(() => {
        return predictions.sub(labels).square().mean();
    })
}

const learningRate = 0.0001;
const optimizer = tf.train.sgd(learningRate);

const numIteration = 500;
const errors = [];

for (let i = 0; i < numIteration; i++){
    optimizer.minimize(() => {
        const ypred = predict(xtrain, ytrain);
        const e = loss(ypred, ytrain);
        errors.push(e.dataSync());
        return e;
    })
}

console.log(errors[0]);
console.log(errors[numIteration-1]);
console.log("m = " + m);
console.log("b = " + b);