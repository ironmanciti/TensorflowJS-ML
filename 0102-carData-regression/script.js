//자동차 데이터를 관심 있는 변수로 줄이고 누락된 데이터를 제거합니다.
async function getData(){
   
}

function createModel(){
 
}

/*
입력 데이터를 기계 학습에 사용할 수 있는 텐서로 변환합니다.
또한 데이터를 셔플링하고 MPG를 정규화 할 것입니다.
*/
function convertToTensor(data){
    return tf.tidy(() => {
        //step1. 데이터 셔플링

        //step2. 데이터를 2D tensor로 변환 : [num_examples, num_features_per_example]
       

        //step3. 0-1사이로 min-max scaling (데이터 정규화)

    });
}

async function trainModel(model, inputs, labels){
   
}

function testModel(model, inputData, normalizationData){

    //0-1사이로 가상의 input data 100개 생성하여 예측
    //학습 data와 동일한 [num_examples, num_features_per_example]로 생성
      
}

async function run(){
    //훈련할 원본 입력 데이터를 로드
    
    //모델 생성 
  
    //훈련할 데이터 변환
   
    //model Train  
  
    //예측 및 original data와 비교
    
}

document.addEventListener('DOMContentLoaded', run);