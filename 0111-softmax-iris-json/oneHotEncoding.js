//** category 변수의 one-hot-encoding
const myArray = [
    {x: [1, 0], y: 0},
    {x: [5, 1], y: 1},
    {x: [1, 1], y: 2}
]

//label 생성
const labels = myArray.map(v => v.y) 
console.log(labels)

//one-hot-encoding
let labelTensor = tf.tensor1d(labels, "int32");
labelTensor = tf.oneHot(labels, 3);
console.log(labelTensor.arraySync())

