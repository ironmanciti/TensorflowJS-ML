import 'bootstrap/dist/css/bootstrap.css';
import * as tf from '@tensorflow/tfjs';
document.getElementById("hello").innerText = "Hello";

const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

const height = tf.tensor2d([6, 5.8, 6.2, 5.1, 5.5, 5.7], [6, 1]);
const weight = tf.tensor2d([80, 75, 85, 65, 72, 75], [6,1]);

model.fit(height, weight, {epoch: 100}).then(() => {
    model.predict(tf.tensor2d([6], [1,1])).print();
})