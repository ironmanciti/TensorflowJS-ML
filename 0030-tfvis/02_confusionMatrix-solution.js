// 혼동행렬 그리기
async function run() {
    // multi-class 분류에 대한 실제 레이블 및 예측값 정의
    const labels = tf.tensor1d([0, 1, 2]); // 실제 레이블들
    const predictions = tf.tensor1d([1, 1, 2]); // 모델의 예측값들

    // tfvis.metrics.confusionMatrix 함수를 사용하여 혼동 행렬을 계산
    // 이 함수는 Promise를 반환하므로, await를 사용하여 비동기적으로 결과를 받아옵니다.
    result = await tfvis.metrics.confusionMatrix(labels, predictions);

    console.log(result) // 혼동 행렬을 콘솔에 출력

    const surface = {
        name: 'Confusion Matrix',  // tfvis 창의 이름을 지정
        tab: 'Charts'  // tfvis 창의 탭을 지정
    };
    const data = {
        values: result  // 혼동 행렬의 값을 data 객체에 저장
    };

    // tfvis.render.confusionMatrix 함수를 사용하여 혼동 행렬을 시각화
    tfvis.render.confusionMatrix(surface, data);
}
run();



