let net;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');
  // Webcam 연결
  const videoElement = document.getElementById('webcam');
  const webcamIterator = await tf.data.webcam(videoElement);

  while (true) {
    const img = await webcamIterator.capture();
    const result = await net.classify(img);

    document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;

    img.dispose();
    // Give some breathing room by waiting for the next animation frame to
    // fire. 다음 frame 을 기다리는 일종의 sugar method
    await tf.nextFrame();
  }
}

app();