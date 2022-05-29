// const a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
// const b = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);

// //** 메모리 상의 tensor 갯수
// console.log(tf.memory().numTensors)

// //** dispose - manually memory 관리
// a.dispose();
// console.log(tf.memory().numTensors);
// b.dispose();
// console.log(tf.memory().numTensors);

// //**tidy - automatic memory 관리
// //** 함수가 반환하지 않는 모든 tf.Tensor를 정리
// tf.tidy(() => {
//     const a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
//     const b = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
//     console.log(tf.memory().numTensors);
// })
// console.log(tf.memory().numTensors);

