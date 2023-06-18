let model;      // 학습할 모델
let dataPoints; // 로드된 데이터를 저장할 변수
let X_train, X_test, y_train, y_test;  // 학습 및 테스트 데이터
let normParams;   // 정규화를 위한 최소값, 최대값 저장

//tfvis의 visor toggle
function toggleVisor() {

}

// Min-Max 정규화 함수
function MinMaxScaling(tensor, prevMin = null, prevMax = null) {
  
}

//data point 시각화
async function plot(dataPoints) {
  
}

async function run() {
  // csv data loading
  const dataUrl = "Social_Network_Ads.csv";

  const socialSales = tf.data.csv(dataUrl, {
    columnNames: ["UserID", "Gender", "Age", "EstimatedSalary", "Purchased"],
    columnConfigs: {
     
    },
 
  });

  

  // 카테고리 변수 처리 (Male -> 1, Female -> 0)


  // feature extraction and tensor 변환
  

  // 훈련용/테스트용 데이터 셋 분리 (75% 훈련용, 25% 테스트용)
  

  // 데이터 정규화 (MinMaxScaling)
  

  // 모델 훈련 버튼 활성화

}

async function train() {
  // layers API 를 이용하여 sequential model 구축


  // sequential 모델 생성 및 설정
  

  // 모델 훈련 (fit)
  

  // 예측 버튼 활성화 및 훈련 완료 알림
 
  // confusion matrix 생성 및 시각화
  

  //confusion matrix
  

  //memory 정리
 
}

// 모델을 이용한 예측 함수
async function predict() {
  // 예측에 필요한 입력 값 받아오기

  if (isNaN(predInputTwo) || isNaN(predInputTwo) || isNaN(predInptThree)) {
    alert("숫자를 입력하세요");
  } else {
    
    // 예측 결과 출력
   
  }
}

// 웹 페이지 로딩이 완료되면 run 함수 실행
document.addEventListener("DOMContentLoaded", run);
