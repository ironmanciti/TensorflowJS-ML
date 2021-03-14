let mobileModel;
let img;
let webcamIterator;

const knnModel = knnClassifier.create();

// Webcam 연결
const videoElement = document.getElementById('webcam');

// 웹캠으로부터 읽어들인 이미지를 특정 class 로 지정
const addExample = async (classId) => {
  img = await webcamIterator.capture();
  // MobileNet 의 conv_preds layer 의 logit 을 KNN 의 example 로 추가
  const logit = mobileModel.infer(img, 'conv_preds');
  knnModel.addExample(logit, classId);
  img.dispose();
};
  
async function app() {
  // mobileNet mobileModel 로딩
  mobileModel = await mobilenet.load();
  console.log('Sucessfully loaded mobileModel');

  // Webcam 연결
  webcamIterator = await tf.data.webcam(videoElement);

  // Button click 시 마다 해당 class 의 example 을 KNN 에 추가
  document.getElementById('class-a').addEventListener('click', () => addExample(0));
  document.getElementById('class-b').addEventListener('click', () => addExample(1));
  document.getElementById('class-c').addEventListener('click', () => addExample(2));

  while (true) {
    img = await webcamIterator.capture();
    
    if (knnModel.getNumClasses() > 0) {
      // Webcam 에서 받은 image 의 MobleNet logit 을 KNN 의 prediction 에 입력
      const logits = mobileModel.infer(img, 'conv_preds');

      // K-nearest predictio. default=3. {label, classIndex, confidence} 를 반환
      const result = await knnModel.predictClass(logits);

      // KNN 이 분류한 class 를 browser 에 표시
      const classes = ['class-a', 'class-b', 'class-c'];
      document.getElementById('console').innerText = `
        prediction: ${classes[result.classIndex]}\n
        probability: ${result.confidences[result.classIndex]}
      `;
      logits.dispose();
    }

    await tf.nextFrame();
  }
}

app();

