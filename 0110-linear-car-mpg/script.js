//carsData data 중 자동차 마력을 기준으로 연비 예측하는 Linear Model 작성
//Data load
//Missing data cleansing - 갤런당 마일이나 마력이 정의되지 않은 항목 삭제
async function getData() {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataReq.json();
  const cleaned = carsData.map(car => ({
      x: car.Miles_per_Gallon,
      y: car.Horsepower,
    }))
    .filter(car => (car.x != null && car.y != null));
  return cleaned;
}

//data 를 shuffling하고 tensor 로 convert 및 normalizing 
function convertToTensor(data) {
  return tf.tidy(() => {  //중간 텐서 모두 삭제
    // Step 1. data shuffling
   

    // Step 2. data 를 input/label Tensor로 변환


    //Step 3. min-max scaling

    
    return {
      inputs: normedInputs,
      labels: normedLabels,
      // evaluation 및 predict 단계에서 사용할 min, max data
      // 출력을 정규화하지 않은 원래의 상태로 다시 되돌려서 원래의 조정으로 가져오고 향후 입력 데이터를 
      // 동일한 방식으로 정규화할 수 있도록 학습 중에 정규화에 사용한 값을 유지
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });  
}
  
// NN 모델 생성
//input : 마력, output : 연비
function createModel() {
    
}   
// NN model compile and train
async function trainModel(model, inputs, labels) {
  
}

function testModel(model, X_test, y_test, tensorData) {

  // 훈련된 model 을 이용하여 test data prediction

  // 원래 scale로 de-normalization

 
  // tf array는 Float32Array type 이므로 
  // Array.from() method 로 일반 array 전환 및 object 변환
  // Array.prototype.map((element, index) => { ... })
  

  //시각화 하여 input의 원래 label 과 prediction 비교
  
    
}

// main run 함수
async function run() {
  // 훈련할 원본 입력 데이터를 로드하고 플로팅


  //input data 분포 시각화
  
  
  //NN model 생성


  //data 를 tensor 로 변환
  
  
  //model train
 
  
  //model test

  
}

document.addEventListener('DOMContentLoaded', run);


