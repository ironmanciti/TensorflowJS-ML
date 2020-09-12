// DOM Element Access
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

/*-------------- webcam activation begin -----------------------------*/
// webcam access 가능여부 check
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
// getUsermedia parameters to force video but not audio.
const constraints = {
video: true
};
// Activate the webcam stream.
navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
video.srcObject = stream;
video.addEventListener('loadeddata', predictWebcam);
});
/*----------------- webcam activation end -----------------------------*/

// model loading
let model = undefined;
document.getElementById("message").innerHTML = "model loading... wait please..."

cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  document.getElementById("message").innerHTML = "model loaded successfully !!!"
  
});

// predicting
let children = [];

function predictWebcam() {
  // stream 상의 image 분류 시작
  model.detect(video).then((predictions)=> {
    console.log(predictions);
    //Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);  //배열의 모든 요소 제거
    
    // high confidence score 를 가진 predictions 을 live view 에 drawing
    for (let n = 0; n < predictions.length; n++) {
      // score 66% 이상이면 drawing
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);

        children.push(highlighter);
        children.push(p);
      }
    }
    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}