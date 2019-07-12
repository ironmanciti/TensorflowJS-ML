let net;

const classifier = knnClassifier.create();  //KNNImageClassifier() instance 반환

const webcamElement = document.getElementById('webcam');

async function setupWebcam() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;     //windows.navigator 객체
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
          stream => {
            webcamElement.srcObject = stream;
            webcamElement.addEventListener('loadeddata',  () => resolve(), false);
          },
          error => reject());
      } else {
        reject();
      }
    });
  }
  
  async function app() {
    console.log('Loading mobilenet..');
  
    // mobilenet model loading
    net = await mobilenet.load();
    console.log('Sucessfully loaded model');
  
    await setupWebcam();   
  
    // image 를 webcam 에서 읽고 특정 class 로 지정
    const addExample = classId => {
      // MobileNet 의 'conv_preds' layer 의 logit 을 KNN 의 example 로 추가
      const activation = net.infer(webcamElement, 'conv_preds');

      classifier.addExample(activation, classId); 
    };
  
    // button click 시 마다 해당 class 의 example 을 KNN 에 추가
    document.getElementById('class-a').addEventListener('click', () => addExample(0));
    document.getElementById('class-b').addEventListener('click', () => addExample(1));
    document.getElementById('class-c').addEventListener('click', () => addExample(2));
  
    while (true) {
      if (classifier.getNumClasses() > 0) {   //Get the total number of classes
        // webcam 에서 받은 image 의 MobileNet logit 을 KNN 의 prediction 에 입력
        const activation = net.infer(webcamElement, 'conv_preds');
        // K-nearest prediction, default k=3. {label, classIndex, confidences} return
        const result = await classifier.predictClass(activation);
  
        const classes = ['A', 'B', 'C'];
        document.getElementById('console').innerText = `
          prediction: ${classes[result.classIndex]}\n
          probability: ${result.confidences[result.classIndex]}
        `;
      }
  
      await tf.nextFrame();
    }
  }

app();

// async function app() {
//   console.log('Loading mobilenet..');

//   // Load the model.
//   net = await mobilenet.load();
//   console.log('Sucessfully loaded model');

//   // Make a prediction through the model on our image.
//   const imgEl = document.getElementById('img');
//   const result = await net.classify(imgEl);
//   console.log(result);
// }

// async function app() {
//     console.log('Loading mobilenet..');

//     // Load the model.
//     net = await mobilenet.load();
//     console.log('Sucessfully loaded model');

//     await setupWebcam();
//     while (true) {
//         const result = await net.classify(webcamElement);

//         document.getElementById('console').innerText = `
//         prediction: ${result[0].className}\n
//         probability: ${result[0].probability}
//         `;

//         // Give some breathing room by waiting for the next animation frame to
//         // fire.
//         await tf.nextFrame();
//     }
// }