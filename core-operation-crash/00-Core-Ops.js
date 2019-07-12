const tf = require('@tensorflow/tfjs-node-gpu')
// Tensors
const tense1 = tf.tensor([1,2,3,4]);
const tense2 = tf.tensor([1,2,3,4], [4]);
const tense3 = tf.tensor([1,2,3,4], [1, 4]);
const tense4 = tf.tensor([1,2,3,4], [2, 2]);
const tense5 = tf.tensor([1,2,3,4,5,6,7,8], [2,2,2]);
tense1.print();
tense2.print();
tense3.print();
tense4.print();
tense5.print();

// 2d tensor
const shape = [2, 3];   //2 rows, 3 columns
let a = tf.tensor([1.0, 2.0, 3.0, 10.0, 20.0, 30.0], shape);
tf.print(["a = tensor / shape([2,3]) ", a]);

let b = tf.tensor([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]]);
tf.print(["b = tensor / 2d array ", b]);

const c = tf.tensor2d([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]])
tf.print(["c = tensor2d / ", c]);
console.log(c);

// 2d tensor of 3x5 ones
const zeros = tf.zeros([3, 5]);
tf.print(["tf.zeros = ", zeros]);
3d tensor of 2X3X2
tf.tensor3d([1,2,3,4,5,6,7,8,8,10,11,12], [2,3,2]).print();

// Variables
const initialValues = tf.zeros([5]);
const biases = tf.variable(initialValues);
tf.print(['bias with initalValues = ', biases]);
// variable 은 mutable
const updatedValues = tf.tensor1d([0,1,0,1,0]);
biases.assign(updatedValues);
tf.print(["bias 는 variable 이므로 mutable / updated biases = ", biases]);

// scalar 
tf.scalar(4).print();

// operations
const d = tf.tensor2d([[1.0, 2.0],[3.0, 4.0]]);
const d_squared = d.square();
console.log('d', d.toString());
console.log('d_squared = ', d_squared.toString());
// add, sub, mul, div
const e = tf.tensor2d([[1.0, 2.0], [3.0, 4.0]]);
const f = tf.tensor2d([[5.0, 6.0], [7.0, 8.0]]);
tf.print(['e = ', e]);
tf.print(['f = ', f]);
let e_plus_f = e.add(f);
tf.print(['e + f = ', e_plus_f]);

e_minus_f = e.sub(f);
tf.print(['e - f = ', e_minus_f]);

let sq_sum = e.add(f).square();
tf.print(['(e+f)^2 = ', sq_sum]);
sq_sum = tf.square(tf.add(e,f));
tf.print(['(e+f)^2 = ', sq_sum]);

// 나머지
a = tf.tensor1d([1, 4, 3, 16]);
b = tf.tensor1d([1, 2, 9, 4]);
console.log('mod([1, 4, 3, 16], [1, 2, 9, 4]) = ')
a.mod(b).print();  // or tf.mod(a, b)

//지수승
a = tf.tensor([[1, 2], [3, 4]])
b = tf.tensor(2).toInt();

a.pow(b).print();  // or tf.pow(a, b)

//shape of tensor
console.log(a.shape);
console.log(a.size);
console.log(a.dtype);

//min, max, mean
let x = tf.tensor1d([1, 2, 3]);
tf.min(x).print();
tf.max(x).print();
tf.mean(x).print();

x = tf.tensor2d([1, 2, 3, 4], [2, 2]);

const axis = 1;

x.min(axis).print(); 
x.max(axis).print(); 
x.mean(axis).print();  // or tf.mean(x, axis)

// broadcasting
const c = tf.tensor2d([[1,2,3,4], [5,6,7,8]])
c.print();
tf.add(c, a).print();
tf.mul(c, a).print();

// Matrix Multiplication
a = tf.tensor2d([1, 2], [1, 2]);
b = tf.tensor2d([1, 2, 3, 4], [2, 2])
a.mul(b).print();
a.matMul(b).print(); // or tf.matMul(a, b)

// 기타 operation
console.log(tf.tensor([[1, 2], [3, 4]]).get(0, 1));

// Models and Layers
function predict(input){
    //y = w1*x^2 + w2*x + w0
    return tf.tidy(() => {
        const x = tf.scalar(input);
        const ax2 = w1.mul(x.square());
        const bx = w2.mul(x);
        const y = ax2.add(bx).add(w0);
        return y
    })
}

const w1 = tf.scalar(2);
const w2 = tf.scalar(4);
const w0 = tf.scalar(8);

const result = predict(2);
tf.print(['predict result = ', result]);

// Promise
const values = [];

for (let i = 0; i < 30; i++){
values[i] = Math.floor(Math.random() * 100);
}

const shape = [2, 3, 5]
const tense3d = tf.tensor3d(values, shape, "int32");
tense3d.print();

tense3d.data().then((result) => console.log('promise - ' + result)); //async download values

console.log('synchronous - ' + tense3d.dataSync()); //synchronously download values

console.log('get(0,0,1)', tense3d.get(0,0,1));
