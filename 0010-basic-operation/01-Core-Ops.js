// // Tensors
// const tense1 = tf.tensor([1,2,3,4]);
// const tense2 = tf.tensor([1,2,3,4], [4]);
// const tense3 = tf.tensor([1,2,3,4], [1, 4]);
// const tense4 = tf.tensor([1,2,3,4], [2, 2]);
// const tense5 = tf.tensor([1,2,3,4,5,6,7,8], [2,2,2]);
// tense1.print();
// tense2.print();
// tense3.print();
// tense4.print();
// tense5.print();

// // 2d tensor
// const shape = [2, 3];   //2 rows, 3 columns
// let a = tf.tensor([1.0, 2.0, 3.0, 10.0, 20.0, 30.0], shape);
// tf.print(["a = tensor / shape([2,3]) ", a]);
// a.print(true)
// let b = tf.tensor([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]]);
// tf.print(["b = tensor / 2d array ", b]);
// const c = tf.tensor2d([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]])
// tf.print(["c = tensor2d / ", c]);
// console.log(c);

// // 2d tensor of 3x5 ones
// const zeros = tf.zeros([3, 5]);
// tf.print(["tf.zeros = ", zeros]);

// //3d tensor of 2X3X2
// tf.tensor3d([1,2,3,4,5,6,7,8,8,10,11,12], [2,3,2]).print(true);

// Variables
// const vtense = tf.variable(tf.tensor([1,2,3,4]));
// vtense.print();
// vtense.assign(tf.tensor([3,4,5,6]));
// vtense.print();

// // scalar 
// tf.scalar(4).print();

// operations
// const d = tf.tensor2d([[1.0, 2.0],[3.0, 4.0]]);
// const d_squared = d.square();
// console.log('d', d.toString());
// console.log('d_squared = ', d_squared.toString());

// // add, sub, mul, div
// const e = tf.tensor2d([[1.0, 2.0], [3.0, 4.0]]);
// const f = tf.tensor2d([[5.0, 6.0], [7.0, 8.0]]);
// tf.print(['e = ', e]);
// tf.print(['f = ', f]);
// let e_plus_f = e.add(f);
// tf.print(['e + f = ', e_plus_f]);
// e_minus_f = e.sub(f);
// tf.print(['e - f = ', e_minus_f]);
// let sq_sum = e.add(f).square();
// tf.print(['(e+f)^2 = ', sq_sum]);
// sq_sum = tf.square(tf.add(e,f));
// tf.print(['(e+f)^2 = ', sq_sum]);
// g = e.add(f);
// console.log(g.dataSync());

// // 나머지
// console.log('mod([1, 4, 3, 16], [1, 2, 9, 4]) = ')
// a.mod(b).print();  // or tf.mod(a, b)

// //지수승
// const a = tf.tensor([[1, 2], [3, 4]])
// const b = tf.tensor(2.5).toInt();

// a.pow(b).print();  // or tf.pow(a, b)

// //shape of tensor
// console.log(a.shape);
// console.log(a.size);
// console.log(a.dtype);

// //min, max, mean
// let x = tf.tensor1d([1, 2, 3]);
// tf.min(x).print();
// tf.max(x).print();
// tf.mean(x).print();

// x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
// const axis = 1;
// x.min(axis).print(); 
// x.max(axis).print(); 
// x.mean(axis).print();  // or tf.mean(x, axis)

// // Matrix Multiplication
// a = tf.tensor2d([1, 2], [1, 2]);
// b = tf.tensor2d([1, 2, 3, 4], [2, 2])
// a.mul(b).print();
// a.matMul(b).print(); // or tf.matMul(a, b)

// // broadcasting
// a = tf.tensor1d([1,2,3,4])
// c = tf.tensor2d([[1,2,3,4], [5,6,7,8]])
// c.print();
// tf.add(c, a).print();
// tf.mul(c, a).print();

// split data
// const x = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5, 2]);
// x.print();
// const [X_train, X_test] = tf.split(x, [3, 2]);
// X_train.print();
// X_test.print();

// //concatenate
// let a = tf.tensor2d([[1, 2, 3, 4], [5, 4, 3, 2]]);
// let c = tf.tensor2d([[3, 4, 5, 6], [5, 6, 7, 8]]);
// a.print();
// c.print();
// tf.concat([a, c], axis = 1).print();

// feature sacling :  MinMax scaling
// x.print();
// min = x.min();
// max = x.max();

// min.print();
// max.print();
// scaled = x.sub(min).div(max.sub(min))
// scaled.print();

// Promise
// function _promise() {
//     return new Promise((resolve, reject) => {
//         window.setTimeout(() => {
//             resolve(1);
//         }, 3000);
//     });
// }

// _promise().then((result) => {
//     console.log("Promise success : ", result);
// }).catch((e) => {
//     console.log(e);
// })

// async function makeRequest() {
//     await window.setTimeout(() => {
//         console.log("async, await success");
//     }, 3000);
// }

// makeRequest();

// scaled.data().then((result) => {
//     console.log("Asynchronous Promise returned : ", result);
// })
// console.log("synchronous First : ", scaled.dataSync());

// async, await

// async function run() {
//     const data = await scaled.data();
//     console.log(data);
//     console.log("async 함수 내에서 await 수행 완료 후 수행");
// }

// run();

// //aync function returns promise
// run().then(() => {
//     console.log('success');
// }).catch((e) => {
//     console.log(e);
// })
