let mobilenet
let model
const webcam = new Webcam(document.getElementById('wc'));
const dataset = new RPSDataset();
let rockSamples = 0;
let paperSamples = 0;
let scissorsSamples = 0;

//webcam image의 truncated mobilenet 출력을 training example 로 add
function handleButton(elem) {
    
}

//model train
async function train() {
    //label들을 one-hot-encoding
    
    // console.log(dataset.xs, dataset.ys);

    //전이학습 model 생성
    
    // model.summary();

    //model compile 및 train
    
}

//prediction loop
async function predict() {
    while (isPredicting) {
        //webcam image 를 이용하여 prediction
        

        //prediction 결과 display
        
    }
}

function doTraining() {
    
}

function startPredicting() {
    
}

function stopPredicting() {
  
}

//webcam 초기화, truncated mobilenet load
async function init() {
    await webcam.setup()
    mobilenet = await
    tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    const layer = mobilenet.getLayer('conv_pw_13_relu');

    //truncated mobilenet model 생성
   
}

init();
