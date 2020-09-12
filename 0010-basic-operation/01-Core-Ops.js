// //Tensors
// const tense1 = tf.tensor([1,2,3,4]);
// const tense2 = tf.tensor([1,2,3,4], [4]);     //rank 0
// const tense3 = tf.tensor([1,2,3,4], [1, 4]);  //rank 1
// const tense4 = tf.tensor([1,2,3,4], [2, 2]);  //rank 2
// const tense5 = tf.tensor([1,2,3,4], [2,2,1]); //rank 3
// tense1.print();
// tense2.print();
// tense3.print();
// tense4.print();
// tense5.print();

// //2d tensor
// const verbose = true;
// tf.tensor2d([1, 2, 3, 4], [2, 2]).print(verbose);

// let a = tf.tensor2d([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]]);
// tf.print(["a = tensor / 2d array ", a]);
// console.log(a);

// // 2d tensor of 3x5 ones
// const zeros = tf.zeros([3, 5]);
// tf.print(["tf.zeros = ", zeros]);

// //3d tensor of 2X3X2
// tf.tensor3d([1,2,3,4,5,6,7,8,8,10,11,12], [2,3,2]).print(true);

// //Variables
// const vtense = tf.variable(tf.tensor([1,2,3,4]));
// vtense.print();
// vtense.assign(tf.tensor([3,4,5,6]));
// vtense.print();

// // scalar 
// tf.scalar(4).print();

// //operations
// const d = tf.tensor2d([[1.0, 2.0],[3.0, 4.0]]);
// d.square().print();
// console.log(d.toString() + '\n' + d.square().toString());

// // add, sub, mul, div
// const e = tf.tensor2d([[1.0, 2.0], [3.0, 4.0]]);
// const f = tf.tensor2d([[5.0, 6.0], [7.0, 8.0]]);

// e.add(f).print();
// e.sub(f).print();
// e.mul(f).print();
// e.div(f).print();

// // 나머지
// const a = tf.tensor([1, 4, 3, 16]);
// const b = tf.tensor([1, 2, 9, 4]);
// a.mod(b).print();  // or tf.mod(a, b)

// //지수승
// const a = tf.tensor([[1, 2], [3, 4]])
// const b = tf.tensor(2.5);

// a.pow(b).print();  // or tf.pow(a, b)

// //shape of tensor
// console.log(a.shape);
// console.log(a.size);
// console.log(a.dtype);

// // Matrix Multiplication
// a = tf.tensor2d([1, 2, 3], [1, 3]);
// b = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2])
// console.log(a.shape);
// console.log(b.shape);

// a.matMul(b).print(); // or tf.matMul(a, b)

// //split data
// //tf.split(x, [number1, number2, ...])
// const x = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5, 2]);
// x.print();
// const [X_train, X_test] = tf.split(x, [3, 2]);
// X_train.print();
// X_test.print();

// // feature sacling :  MinMax scaling
// min = X_train.min();
// max = X_train.max();
// min.print()
// max.print()

// scaled = X_train.sub(min).div(min.sub(max))
// scaled.print()

// //concatenate
// let a = tf.tensor2d([[1, 2, 3, 4], [5, 4, 3, 2]]);
// let c = tf.tensor2d([[3, 4, 5, 6], [5, 6, 7, 8]]);
// a.print();
// c.print();
// tf.concat([a, c], axis = 1).print();


// //Promise
//비동기식 처리
// window.setTimeout(() => {
//     console.log('setTimeout called')
// }, 1000);

// console.log('After setTimeout');

// 동기식 처리 (Promise)
// function _promise() {
//     return new Promise((resolve, reject) => {
//         window.setTimeout(() => {
//             console.log('setTimeout called')
//             resolve();
//         }, 1000)
//     })
// }

// _promise().then((result) => {
//     console.log("After setTimeout ", result);
// }).catch(e => {
//     console.log(e);
// })

// 동기식 처리 (async, await)
// async function run(){
//     await new Promise((resolve, reject) => {
//         window.setTimeout(() => {
//             console.log('setTimeout called')
//             resolve(1);
//         }, 1000)
//     });
//     console.log('After setTimeout')
// }

// run();

// tf.Tensor.data - tf.Tensor 로부터 비동기식 download
// const scaled = tf.tensor1d([1, 2, 3])
// scaled.data().then((result) => {
//     console.log("Asynchronous Promise returned : ", result);
// })
// console.log("synchronous First : ", scaled.dataSync());

// 동기식으로 처리
// async function run() {
//     const data = await scaled.data();
//     console.log(data);
//     console.log("data download 완료 후 동기식으로 수행");
// }

// run();

// //aync function returns promise
// run().then(() => {
//     console.log('success');
// }).catch((e) => {
//     console.log(e);
// })
