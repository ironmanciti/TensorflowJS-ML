async function run(){
    //const labels      = tf.tensor1d([0, 0, 1, 0, 1, 0]);  //이진분류
    //const predictions = tf.tensor1d([0, 1, 0, 1, 1, 0]);
    const labels      = tf.tensor1d([1, 2, 4]);   //multi-class 분류
    const predictions = tf.tensor1d([2, 2, 4]);
    result = await tfvis.metrics.confusionMatrix(labels, predictions);
    console.log(result)
    const data = { values : result };
    const surface = { name: 'Confusion Matrix', tab: 'Charts' };
    tfvis.render.confusionMatrix(surface, data, { shadeDiagonal: true });
}
run();

