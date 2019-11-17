async function run(){
    const labels = tf.tensor1d([1, 2, 4]);
    const predictions = tf.tensor1d([2, 2, 4]);
    result = await tfvis.metrics.confusionMatrix(labels, predictions);
    console.log(result)
    const data = { values : result };
    const surface = { name: 'Confusion Matrix', tab: 'Charts' };
    tfvis.render.confusionMatrix(surface, data, { shadeDiagonal: false });
}
run();

