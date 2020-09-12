//test data 생성
const values = [];

for (let i = 0; i < 15; i++){
    values[i] = Math.floor(Math.random() * 100);
}
//tensor 생성
const shape = [5, 3];

const a = tf.tensor2d(values, shape);
const b = tf.tensor2d(values, shape);
//memory 상의 tensor 숫자
console.log(tf.memory().numTensors);

//manually memory 관리
a.dispose(); 
b.dispose();
console.log(tf.memory().numTensors);

// automatic memory 관리
tf.tidy(() => { 
    const a = tf.tensor2d(values, shape);
    const b = tf.tensor2d(values, shape);
    console.log(tf.memory().numTensors);
})
console.log(tf.memory().numTensors);

document.write(tf.memory().numTensors)