// 피보나치 수는 F_n = F_n-1 + F_n-2 로 구성되는 수열이다.
// next 피보나치 수를 regression 하는 문제

function fibonacci(num){
    let a = 1, b = 0, temp;
    const seq = [];

    while(num > 0){
        seq.push(b);
        [a, b] = [b, a]
        b = a + b;
        num--;
    }

    return seq;
}
// data 준비
const fibs = fibonacci(100);
const xs = tf.tensor1d(fibs.slice(0, fibs.length-1));
const ys = tf.tensor1d(fibs.slice(1))
console.log(fibs);
xs.print();
ys.print();
//min-max scaling
const xmin = xs.min();
const xmax = xs.max();
const ymin = ys.min();
const ymax = ys.max();
const xsNorm = xs.sub(xmin).div(xmax.sub(xmin));
const ysNorm = ys.sub(ymin).div(ymax.sub(ymin));

// Linear Regression model - Y = aX + b
const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));

function predict(x){
    return tf.tidy(() => {
        return a.mul(x).add(b);
    })
}

// loss function - MSE
function loss(predictions, labels){
    return predictions.sub(labels).square().mean();
}

const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

// training
const numIteration = 10000;
const errors = [];

for (let i = 0; i < numIteration; i++){
    optimizer.minimize(() => {
        const predYs = predict(xsNorm);
        const e = loss(predYs, ysNorm);
        errors.push(e.dataSync());
        return e;
    })
}

console.log(errors[0]);
console.log(errors[errors.length-1]);

xTest = tf.tensor1d([75025]);
const xTestNormed = xTest.sub(xmin).div(xmax.sub(xmin));
const pred = predict(xTestNormed)

const xTestDenormed = pred.mul(xmax.sub(xmin)).add(xmin);
xTestDenormed.print();

a.print();
b.print();
