// 모델 훈련의 에폭 수 지정
const EPOCHS = 10;
let XnormParams, YnormParams, model;

// TensorFlow.js Visor를 토글하는 함수
function toggleVisor() {

}

// 데이터를 Min-Max 스케일링을 이용하여 정규화하는 함수
function MinMaxScaling(tensor, prevMin = null, prevMax = null) {
 
}
// 데이터를 denormalize 하는 함수
function denormalize(tensor, min, max) {

}

/ 모델을 훈련하는 main 함수
async function train() {
  // CSV 데이터 불러오기
  const HouseSalesDataset = tf.data.csv("kc_house_data.csv", {
    
  })
  //csv 파일의 특정 column만 불러와 tf.data.Dataset 객체 생성
 

  //tf.data.Dataset객체의 모든 요소를 array로 변환하여 shuffle

  // 데이터를 tfvis를 사용하여 그래프로 시각화


  // 데이터셋에서 특성 및 레이블 추출
 
  // console.log(featureValues);

  // 특성과 레이블에 대한 텐서 생성
  //[data point 갯수, feature 갯수]를 tensor의 dimension으로 지정
 

  // 데이터셋을 훈련 세트와 테스트 세트로 75:25로 분할
  

  // 데이터 정규화



  // 정규화된 데이터 시각화
  
  // 모델 구성
  

  // 훈련 중 상태 시각화를 위한 콜백 함수
  

  // 모델 훈련
 

  // train, validation loss 출력
 

  //train 완료 후 prediction button 활성화
}

// 예측 함수
async function predict() {
  const predictionInput = parseInt(
   
  );
  // 예측 입력값이 숫자가 아니라면 알림을 띄움
  if (isNaN(predictionInput)) {
    alert("숫자를 입력하세요");
  } else {
    tf.tidy(() => {
      // 입력값을 텐서로 변환
     
      // 입력값 정규화
     
      // 예측 수행
      
      // 예측 결과를 원래 스케일로 변환
     
      // 예측 결과 출력

      // 예측 결과를 시각화하기 위한 라인 그리기
     
    });
  }
}
