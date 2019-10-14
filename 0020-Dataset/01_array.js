
const tf = require('@tensorflow/tfjs');

async function run(){
    const myArray = [{ xs: [1, 0, 9], ys: 10 },
                     { xs: [5, 1, 3], ys: 11 },
                     { xs: [1, 1, 9], ys: 12 }];

    const myFirstDataset = tf.data.array(myArray);

    console.log(myFirstDataset)
    await myFirstDataset.forEachAsync(e => console.log(e));
}

run();

