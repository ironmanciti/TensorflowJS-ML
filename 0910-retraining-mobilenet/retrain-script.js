/*
이 코드는 TensorFlow.js를 사용하여 웹캠으로 "바위, 가위, 보" 게임을 플레이하는 인공지능 모델을 훈련하고 예측하는 것입니다. 
*/
//필요한 변수와 객체를 설정
let mobilenet
let model
const webcam = new Webcam(document.getElementById('wc'));
const dataset = new RPSDataset();  
let rockSamples = 0;
let paperSamples = 0;
let scissorsSamples = 0;
let isPredicting;

//webcam image의 truncated mobilenet 출력을 training example 로 추가하는 함수
function handleButton(elem){
    // 버튼 클릭에 따라 바위, 보, 가위 샘플의 수를 증가시키고 화면에 표시
    switch(elem.id){
        case "0":
           
        case "1":
           
        case "2":
           
    }
    // 선택된 라벨(바위, 가위, 보)을 정수로 변환하고, 이미지를 캡처하고 example을 추가
   
}

// 모델 훈련
async function train(){
    //label들을 one-hot-encoding
    dataset.ys = null;
    dataset.encodeLabels(3)
    // console.log(dataset.xs, dataset.ys);

    //새로운 신경망 분류기 생성
    model = tf.sequential({
        
    })
    model.summary();

    //model compile 및 train
    

    await model.fit(dataset.xs, dataset.ys, {
        
    })
    console.log('train.. ends..');
}

//prediction loop
async function predict() {
  while (isPredicting) {
    //webcam image 를 이용하여 prediction
    const predictedClass = tf.tidy(() => {

      //예측 결과인 확률 벡터를 1차원 텐서로 변환(flatten)하고, 
      //가장 확률이 높은 클래스의 인덱스를 반환(argMax)-가위,바위,보
      return predictions.flatten().argMax();
    });

    //prediction 결과 display
    const classId = (await predictedClass.data())[0];
    let predictionText = "";
    switch(classId){
		case 0:
			
		case 1:
			
		case 2:
			
	}
    // 예측된 텍스트를 화면에 출력
			
    predictedClass.dispose();
    // 다음 프레임을 기다립니다.
 
  }
}

// 훈련을 시작하는 함수
function doTraining(){
    
}
// 예측을 시작하는 함수
function startPredicting(){
	
}
// 예측을 중단하는 함수
function stopPredicting(){
}

//초기화 함수
async function init(){
    //webcam 초기화,

    //truncated mobilenet load

    //truncated mobilenet model 생성

    // console.log(mobilenet.outputs[0].shape.slice(1));  //[7, 7, 256]
}
// 초기화 함수를 호출
init();
