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