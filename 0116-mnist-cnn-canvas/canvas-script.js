let ctx;
let rawImage;
let model;
let pos = { x: 0, y: 0 };

//저장되었던 손글씨 인식 모델을 load
async function getModel() {
 
}

//마우스 절대 위치를 설정
function setPosition(e) {
 
}

// 손글씨 그리기
// e - 'mousemove' event
function draw(e) {
  if (e.buttons != 1) return; // 왼쪽 버튼을 클릭했는지 확인
  ctx.beginPath();       // 2D 그래픽 컨텍스트를 시작합니다.
  ctx.lineWidth = 24;    // 선의 너비를 설정
  ctx.lineCap = "round";  //line 의 끝을 rounded 처리
  ctx.strokeStyle = "white";  // 선의 색을 white로 설정
  ctx.moveTo(pos.x, pos.y);   // 현재 위치를 설정
  setPosition(e);             // 마우스 위치를 설정
  ctx.lineTo(pos.x, pos.y);   // 현재 위치에서 마우스 위치까지 선으로 연결
  ctx.stroke();               // 선을 그립니다.
  //canvas 에 그린 그림을 URL 문자열(이미지 정보)로 변환
  rawImage.src = canvas.toDataURL("image/png");
}

// 손글씨를 예측
function predict() {
  //이미지를 grayscale로 변환. gray image 이므로 channel 1
 
  //[280, 280, 1] image resize -> [28, 28, 1] (선형보간법)

  // 이미지를 [1, 28, 28] 크기의 텐서로 변환

  // 모델을 사용하여 이미지를 예측

  // prediction.print(true);
  // 예측 결과 중 가장 큰 값의 인덱스를 가져옵니다.

  // 인덱스를 alert로 출력
  alert(pIndex);
}
//canvas 초기화
function erase() {
  ctx.fillStyle = "black";    // fillStyle를 black로 설정
  // [0, 0, 280, 280] 영역을 black으로 채웁니다.
  ctx.fillRect(0, 0, 280, 280);  
}
//event listener 생성
function init() {
  // canvas 요소를 가져옵니다.

  // rawImage 요소를 가져옵니다.

  // 2D 그래픽 컨텍스트를 가져옵니다.

  // canvas를 초기화


  // mousemove 이벤트에 draw 함수를 바인딩

  // mousedown 이벤트에 setPosition 함수를 바인딩
 

  // predButton 요소를 가져옵니다.

  // predButton의 click 이벤트에 predict 함수를 바인딩

  // clearButton 요소를 가져옵니다.

  // clearButton의 click 이벤트에 erase 함수를 바인딩

}

async function run() {
  model = await getModel();
  init();
  alert("model ready !!, 손글씨를 작성하여 인식시켜 보세요 !");
}

document.addEventListener("DOMContentLoaded", run);