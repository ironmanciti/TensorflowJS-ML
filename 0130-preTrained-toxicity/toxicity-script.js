//입력 문장에 대한 독설 여부를 예측

async function predict(){
    // 독설 여부 판단 임계값을 설정

    // 입력 문장을 가져옵니다.
    
    // 독설 여부 판단 모델을 로드


    // 모델을 사용하여 입력 문장에 대한 독설 여부를 예측


    // 예측 결과를 순회
    for (i = 0; i < predictions.length; i++){
        // 예측 결과의 첫 번째 결과가 독설인 경우
        if (predictions[i].results[0].match){
            // 예측 결과를 HTML prediction에 표시
         
        } else {
            // No insult 를 HTML prediction에 표시합니다.
         
        }
    }
}
