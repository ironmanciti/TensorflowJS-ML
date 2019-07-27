const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const _ = require('lodash');

let iris = require('./iris.json');
debugger;
iris = _.shuffle(iris);

const X = tf.tensor2d(iris.map(item => [
    item.sepal_length, item.sepal_width, item.petal_length, item.petal_width
]))
// iris species 를 One-Hot encoding 
const Y = tf.tensor2d(iris.map(item => [
    item.species === 'setosa' ? 1 : 0,
    item.species === 'versicolor' ? 1 : 0,
    item.species === 'virginica' ? 1: 0,
]));

const trainSize = Math.floor(X.shape[0] * 0.75);
const testSize = X.shape[0] - trainSize;
[X_train, X_test] = tf.split(X, [trainSize, testSize]);
[y_train, y_test] = tf.split(Y, [trainSize, testSize]);

const model  = tf.sequential();
model.add(tf.layers.dense({
    inputShape: [4],
    activation: 'relu',
    units: 50
}));
model.add(tf.layers.dense({
    units: 30,
    activation: 'relu'
}));
model.add(tf.layers.dense({
    units: 3,
    activation: 'softmax'
}))

model.compile({loss:'categoricalCrossentropy', optimizer:'adam'});
model.fit(X_train, y_train, {epochs: 100})
    .then((history) => {
        //console.log(history);
        model.predict(X_test).print();
    })



