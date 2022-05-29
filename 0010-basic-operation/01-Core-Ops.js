// //** Tensors **
// const tense1 = tf.tensor([1,2,3,4]);
// const tense2 = tf.tensor([1,2,3,4], [4]);     //rank 0
// const tense3 = tf.tensor([1,2,3,4], [1, 4]);  //rank 1
// const tense4 = tf.tensor([1,2,3,4], [2, 2]);  //rank 2
// const tense5 = tf.tensor([1,2,3,4], [2, 2, 1]); //rank 3
// tense1.print();
// tense2.print();
// tense3.print();
// tense4.print();
// tense5.print();

// //** 2d tensor 출력 **
// const verbose = true;
// tf.tensor2d([1, 2, 3, 4], [2, 2], 'int32').print(verbose);

// let a = tf.tensor2d([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]]);
// tf.print(["a = tensor / 2d array ", a]);
// console.log(a);

//** 2d tensor of 3x5 ones **
// const zeros = tf.zeros([3, 5]);
// tf.print(["tf.zeros = ", zeros]);
// zeros.print(true);

// //** 3d tensor of 2 X 3 X 2
// tf.tensor3d([1,2,3,4,5,6,7,8,8,10,11,12], [2,3,2]).print(true);

// //**scalar 
// tf.scalar(4).print();

// //**제곱
// const x = tf.tensor2d([[1.0, 2.0],[3.0, 4.0]]);
// const y = x.square();
// y.print();
// console.log(x.toString() + '\n' + x.square().toString());

// //**add, sub, mul, div
// const e = tf.tensor2d([[1.0, 2.0], [3.0, 4.0]]);
// const f = tf.tensor2d([[5.0, 6.0], [7.0, 8.0]]);

// e.add(f).print();
// e.sub(f).print();
// e.mul(f).print();
// e.div(f).print();

// //** transpose - 전치 행렬
// //** reshape - 형상 변경
// a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
// a.print();
// a.transpose().print();
// a.reshape([3, 2]).print();

// //**data 분할
// //tf.split(x, [split1, split2, ...])
// const x = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5, 2]);
// const [X_train, X_val, X_test] = tf.split(x, [2, 2, 1])
// X_train.print();
// X_val.print();
// X_test.print();

// //** MinMax scaling : scaled = (X-min)/(max-min)
// min = X_train.min();
// max = X_train.max();
// min.print()
// max.print()
// scaled = X_train.sub(min).div(max.sub(min))
// scaled.print()

//** Reverse scaling : X = scaled * (max-min) + min
// const X = scaled.mul(max.sub(min)).add(min)
// X.print();

// //** 동기식, 비동기식 처리 비교
// 1. callback 함수는 비동기적으로 실행
// window.setTimeout(() => {
//     console.log('setTimeout called')
// }, 3000);

// console.log('After setTimeout');

// //2.  Promise (ES6) - 비동기 코드 처리  
// function foo(number){
//     return new Promise((resolve, reject) => {
//         window.setTimeout(() => {
//             console.log('setTimeout called');
//             resolve(number+10);
//         }, 1000);
//     });
// }

// foo(0).then((number) => {
//     console.log(number);
//     return foo(number);
// }).then((number) => {
//     console.log(number);
//     return foo(number);
// }).then((number) => {
//     console.log(number);
// })

//** async, await (ES8) - 동기식 처리
// const run = async() => {
//     number = await foo(0);
//     console.log(number);
//     number = await foo(number);
//     console.log(number);
//     number = await foo(number);
//     console.log(number);
// }
// run();

// //**Tensor에서 비동기 method로 값 가져오기(promise 반환)
// //Tensor.array() - 텐서 데이터를 중첩 배열로 반환
// //Tensor.data() - tf.Tensor에서 값을 비동기적으로 다운로드
// const a = tf.tensor([[1, 2], [3, 4]]);
// a.array().then(array => console.log(array));
// a.data().then(data => console.log(data));

//**Tensor에서 동기식 method로 값 가져오기
// //Tensor.arraySync() - 텐서 데이터를 중첩 배열로 반환
// //Tensor.dataSync() - tf.Tensor에서 값을 동기적으로 다운로드
//UI thread차단 문제를 일으킬 수 있으므로 운영 application에서는 비동기식 선호
// console.log(a.arraySync());
// console.log(a.dataSync());

// //**flatten() - 1D array로 tensor 를 flatten
// const xs = tf.tensor([1, 2, 3, 4], [2, 2]);
// xs.print(true);
// xs.flatten().print();
// xs.as1D().print();