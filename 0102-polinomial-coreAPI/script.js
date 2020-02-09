// Quadratic Regression with Core API only
// y = 2 * X**2 + 5 * X
const Xs = tf.linspace(0, 1000, 100);
const Ys = tf.scalar(2).mul(tf.square(Xs)).add(tf.scalar(5).mul(Xs)) 

const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));

const y_pred = x => a.mul(tf.square(x)).add(b.mul(x));

const loss = (prediction, label) => prediction.sub(label).square().mean();
const optimizer = tf.train.adam(0.001);

const EPOCHS = 1500;
for (let i=0; i < EPOCHS; i++){
    optimizer.minimize(() => loss(y_pred(Xs), Ys));
}

// Make predictions.
console.log(`a: ${a.dataSync()}, b: ${b.dataSync()} after ${EPOCHS} iteration`);

const preds = y_pred(Xs).dataSync();
const X = Xs.dataSync();
const Y = Ys.dataSync();

const surface = {name: "Polynomial Regression using Core API", tab: "Charts"};

const series1 = Array.from(X).map((x, i) => ({x, y: Array.from(Y)[i]}));
const series2 = Array.from(X).map((x, i) => ({x, y: Array.from(preds)[i]}));

const data = {values: [series1, series2], series: ['original', 'prediction']};
tfvis.render.scatterplot(surface, data);
