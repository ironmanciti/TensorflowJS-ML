// 혼동행렬 그리기
async function run() {
    //multi-class 분류 
    const labels = tf.tensor1d([0, 1, 2]);
    const predictions = tf.tensor1d([1, 1, 2]);

    // tfvis.metrics.confusionMatrix(labels, predictions, numClasses?) 는 Promise 반환
    result = await tfvis.metrics.confusionMatrix(labels, predictions);
    console.log(result)

    const surface = {
        name: 'Confusion Matrix',
        tab: 'Charts'
    };
    const data = {
        values: result
    };
    tfvis.render.confusionMatrix(surface, data);
}
run();

