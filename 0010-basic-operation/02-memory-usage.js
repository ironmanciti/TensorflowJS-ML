//test data 생성
const values = [];

for (let i = 0; i < 15; i++){
    values[i] = Math.floor(Math.random() * 100);
}
//tensor 생성
const a = tf.tensor2d(values, [5, 3]);
const b = tf.tensor2d(values, [5, 3]);
//memory 상의 tensor 숫자
console.log(tf.memory().numTensors);

//manually memory 관리
a.dispose(); 
b.dispose();
console.log(tf.memory().numTensors);

// automatic memory 관리
// 함수가 반환하지 않는 모든 tf.Tensor를 정리
tf.tidy(() => { 
    const a = tf.tensor2d(values, [5, 3]);
    const b = tf.tensor2d(values, [5, 3]);
    console.log(tf.memory().numTensors);
})
console.log(tf.memory().numTensors);

document.write(tf.memory().numTensors)

//사용중인 backend 찾기
console.log(tf.getBackend());


