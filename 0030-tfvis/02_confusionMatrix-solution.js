// 혼동행렬 그리기
async function run() {
    //multi-class 분류 
    const labels = tf.tensor1d([0, 1, 1, 2, 4, 1, 3, 4]);
    const predictions = tf.tensor1d([0, 1, 2, 2, 4, 2, 3, 3]);

    // tfvis.metrics.confusionMatrix 는 Promise 반환
    result = await tfvis.metrics.confusionMatrix(labels, predictions);

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
