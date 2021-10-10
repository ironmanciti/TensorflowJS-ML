import {MnistData} from "./mnistData.js";

async function showExamples(data) {
  //25 개 sample 을 minstData.js 에서 가져오기
  const examples = data.nextTestBatch(25);
  const numExamples = examples.xs.shape[0]; //25

  //surface instance 생성
  const surface = tfvis
    .visor()
    .surface({ name: "Mnist Data Sample", tab: "Data" });

  // 25x784 인 examples.xs 를 25 개의 28x28x1 array 로 reshape 하여
  // 28x28 size canvas 에 draw
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      //examples.xs.shape -> [25, 784]
      return examples.xs.slice([i, 0], 1).reshape([28, 28, 1]);
    });
    const canvas = document.createElement("canvas");
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = "margin: 4px";
    //convert tensor to image pixel
    await tf.browser.toPixels(imageTensor, canvas); 
    //visor surface 에 append
    surface.drawArea.appendChild(canvas);
    imageTensor.dispose();
  }
}

async function run() {
  const data = new MnistData();
  await data.load();
  //sample data 를 visor 상에 plot
  await showExamples(data);
}

document.addEventListener("DOMContentLoaded", run);