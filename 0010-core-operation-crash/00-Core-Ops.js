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

// let b = tf.tensor([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]]);
// tf.print(["b = tensor / 2d array ", b]);

// const c = tf.tensor2d([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]])
// tf.print(["c = tensor2d / ", c]);
// console.log(c);

// // 2d tensor of 3x5 ones
// const zeros = tf.zeros([3, 5]);
// tf.print(["tf.zeros = ", zeros]);
// //3d tensor of 2X3X2
// tf.tensor3d([1,2,3,4,5,6,7,8,8,10,11,12], [2,3,2]).print();

// // Variables
// const initialValues = tf.zeros([5]);
// const biases = tf.variable(initialValues);
// tf.print(['bias with initalValues = ', biases]);
// // variable 은 mutable
// const updatedValues = tf.tensor1d([0,1,0,1,0]);
// biases.assign(updatedValues);
// tf.print(["bias 는 variable 이므로 mutable / updated biases = ", biases]);

// const vtense = tf.variable(tf.tensor([1,2,3,4]));
// vtense.print();
// vtense.assign(tf.tensor([3,4,5,6]));
// vtense.print();

// // scalar 
// tf.scalar(4).print();

// // operations
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

// // 나머지
// a = tf.tensor1d([1, 4, 3, 16]);
// b = tf.tensor1d([1, 2, 9, 4]);
// console.log('mod([1, 4, 3, 16], [1, 2, 9, 4]) = ')
// a.mod(b).print();  // or tf.mod(a, b)

// //지수승
// a = tf.tensor([[1, 2], [3, 4]])
// b = tf.tensor(2).toInt();

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

// // broadcasting
// a = tf.tensor1d([1,2,3,4])
// c = tf.tensor2d([[1,2,3,4], [5,6,7,8]])
// c.print();
// tf.add(c, a).print();
// tf.mul(c, a).print();

// // Matrix Multiplication
// a = tf.tensor2d([1, 2], [1, 2]);
// b = tf.tensor2d([1, 2, 3, 4], [2, 2])
// a.mul(b).print();
// a.matMul(b).print(); // or tf.matMul(a, b)

// // slicing and joining

// //concatenate
// a = tf.tensor1d([1, 2]);
// b = tf.tensor1d([3, 4]);
// a.concat(b).print();  // or a.concat(b)
// //slicing
// x = tf.tensor1d([1, 2, 3, 4]);
// x.slice([1], [2]).print();
// //slice[start, size]
// x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
// x.slice([1, 0], [1, 2]).print();

// //feature sacling :  MinMax scaling
// // (x - min) / (max - min)
// //[0.3703704, 1, 0.1111111, 0.345679, 0, 0.3333333]
// const t3 = tf.tensor1d([25, 76, 4, 23, -5, 22]);
// const max = t3.max();
// const min = t3.min();

// t3.sub(min).div(max.sub(min)).print();

// //Promise
// const values = [];

// for (let i = 0; i < 30; i++){
// values[i] = Math.floor(Math.random() * 100);
// }

// const shape = [2, 3, 5]
// const tense3d = tf.tensor3d(values, shape, "int32");
// tense3d.print();

// tense3d.data().then((result) => console.log('promise - ' + result)); //async download values

// console.log('synchronous - ' + tense3d.dataSync()); //synchronously download values

// //async, await
// let count = 0;
// function mapping(x) {
//     count++;
//     return x * x;
// }

// async function run() {
//     const arr = await tf.data.array([1, 2, 3, 4, 5, 6])
//         .map(mapping)
//         .skip(2)
//         //.forEachAsync(x => console.log(x))
//         .take(2)
//         .toArray();
//     console.log(`count is ${count} + ${arr}`);
// }

// console.log(run())
// //aync function returns promise
// run().then(() => {
//     console.log('success');
// }).catch((e) => {
//     console.log(e);
// })

// // Exercise 1
// // y = mx + c 수식으로 coding
// //[3, 11, 21] 이 나오도록 coding
// function getYs(xs, m, c){
//     // Your code here 
//     const a = tf.scalar(m);
//     const b = tf.scalar(c);
//     return xs.mul(a).add(b);
// }

// const t1 = tf.tensor1d([1, 5, 10]);
// const t2 = getYs(t1, 2, 1);
// t2.print(); 

// //Exercise 2. rank 가 다른 tensor 간의 연산
// //1d + scalar
// tf.tensor1d([1,2,3]).add(tf.scalar(1)).print();
// //1d + 1d 
// tf.tensor1d([1,2,3]).add(tf.tensor([1,1,1])).print();
// //broadcasting
// tf.tensor1d([1,2,3]).add(tf.tensor2d([[1,1,1]])).print();
// //broadcasting
// tf.tensor1d([1,2,3]).add(tf.tensor2d([[1], [1], [1]])).print();