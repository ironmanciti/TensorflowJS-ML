//입력 문장에 대한 독설 여부를 예측

async function predict(){
    // 독설 여부 판단 임계값을 설정
    const threshold = 0.6;
    // 입력 문장을 가져옵니다.
    const input = document.getElementById("sentence").value;
    // 독설 여부 판단 모델을 로드
    const model = await toxicity.load(threshold);
    console.log("model loaded");

    // 모델을 사용하여 입력 문장에 대한 독설 여부를 예측
    const predictions = await model.classify(input);
    console.log(predictions);

    // 예측 결과를 순회
    for (i = 0; i < predictions.length; i++){
        // 예측 결과의 첫 번째 결과가 독설인 경우
        if (predictions[i].results[0].match){
            // 예측 결과를 HTML prediction에 표시
            document.getElementById("prediction").innerText = 
            `${predictions[i].label}` +
            " found with probability of " +
            `${predictions[i].results[0].probabilities[1].toFixed(4)}`
        } else {
            // No insult 를 HTML prediction에 표시합니다.
            document.getElementById("prediction").innerText = "No insult ";
        }
    }
}
