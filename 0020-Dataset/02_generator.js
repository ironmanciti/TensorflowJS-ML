const tf = require('@tensorflow/tfjs');

let numPlays = 0;

function rollTwoDice() {
    numPlays++;
    return [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
}

function* diceGenerator() {
    while (true) {
        yield rollTwoDice();
    }
}

const myGeneratorDataset = tf.data.generator(diceGenerator);

async function run(){
    await myGeneratorDataset.take(10).forEachAsync(e => console.log(e));
}

run();

