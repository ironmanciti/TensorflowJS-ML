// Linear Regression with Core API only
// y = 2.5 * X + 5 + noise
const X = Array(100).fill(0).map(x => Math.random()*100 - Math.random()*50);
const y = X.map(x => 2.5 * x + 5 + Math.random()*50);

const Xs = tf.tensor2d(X, [100, 1])
const ys = tf.tensor2d(y, [100, 1])

const m = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));

const y_pred = x => m.mul(x).add(b);

const loss = (prediction, label) => prediction.sub(label).square().mean();
const optimizer = tf.train.sgd(0.0005);

tf.tidy(() => {
    for (let i=0; i<100; i++){
        optimizer.minimize(() => loss(y_pred(Xs), ys));
    }
})

// Make predictions.
console.log(`m: ${m.dataSync()}, b: ${b.dataSync()}`);

const preds = y_pred(Xs).dataSync();

const surface = {name: "Linear Regression using Core API", tab: "Charts"};
const series1 = X.map((x, i) => ({'x':x, 'y':y[i]}));
const series2 = X.map((x, i) => ({'x':x, 'y':preds[i]}));
const data = {values: [series1, series2]};
tfvis.render.scatterplot(surface, data);
