async function run(){
    // `mobilenet` 모델을 로드
    const model = await mobilenet.load();
    // 이미지의 ID를 저장
    images = ["img0", "img1", "img2", "img3", "img4"];

    for (let i=0; i<images.length; i++){
        // 이미지 요소를 가져옵니다.
        const imgEl = document.getElementById(images[i]);
        // `model.classify()` 함수를 사용하여 이미지를 분류
        const result = await model.classify(imgEl);
        // 분류 결과를 출력
        console.log(result);
        // 분류 결과를 `outp` 요소의 `innerHTML` 속성에 추가
        outp.innerHTML += "<br/>" + result[0].className + " : " 
                     + result[0].probability.toFixed(4);
    }
    
}
//DOMContentLoaded 이벤트에 대한 리스너를 등록
document.addEventListener("DOMContentLoaded", run);  

