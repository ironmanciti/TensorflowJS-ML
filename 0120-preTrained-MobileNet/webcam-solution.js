// 이 함수는 모바일넷 모델을 사용하여 웹캠에서 이미지를 분류합니다.
async function run(){
    // 모바일넷 모델을 로드합니다.
    const model = await mobilenet.load();
    
    // 웹캠 요소를 가져오고 웹캠 객체를 만듭니다.
    const webcamElement = document.getElementById('webcam');
    const webcam = await tf.data.webcam(webcamElement); 
    console.log("webcam 연결됨");
    
    // 웹캠에서 이미지를 캡처하고 분류하는 무한 루프를 실행합니다.
    while(true) {
        // 웹캠에서 이미지를 캡처합니다.
        const img = await webcam.capture();

        // 모바일넷 모델을 사용하여 이미지를 분류합니다.
        preds = await model.classify(img);
        
        // 분류 결과로 예측 텍스트를 업데이트합니다.
        document.getElementById('predictions').innerText = 
                    `prediction: ${preds[0].className} \n
                    probability: ${preds[0].probability.toFixed(4)}`;

        // 이미지 객체를 폐기합니다.
        img.dispose();
        // 웹캠에서 다음 프레임을 기다립니다.
        await tf.nextFrame();
    }
}

document.addEventListener("DOMContentLoaded", run);  

