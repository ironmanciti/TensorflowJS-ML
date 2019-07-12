const tf = require('@tensorflow/tfjs-node-gpu');

const values = [];

for (let i = 0; i < 15; i++){
values[i] = Math.floor(Math.random() * 100);
}

const shape = [5, 3];

const a = tf.tensor2d(values, shape);
const b = tf.tensor2d(values, shape);

a.dispose(); //manually memory 관리
b.dispose();

console.log(tf.memory().numTensors);
//
tf.tidy(() => { // automatic memory 관리
const a = tf.tensor2d(values, shape);
const b = tf.tensor2d(values, shape);

console.log(tf.memory().numTensors);
})