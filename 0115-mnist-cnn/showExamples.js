import {MnistData} from "./data.js";

async function showExamples(data) {
  //surface instance 생성
  const surface = tfvis.visor().surface({name: "Mnist Data Examples", tab: "Input Data"});

  //sample 을 data.js 에서 가져오기
  const examples = data.nextTestBatch(20);
  // console.log(examples); console.log(examples.xs.shape);
  const numExamples = examples.xs.shape[0]; 

  // 20x784 인 examples.xs 를 20 개의 28x28x1 array 로 reshape 하여
  // 28x28 size canvas 에 draw
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      //examples.xs.shape -> [20, 784]
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])
        .reshape([28, 28, 1]);
    });
    const canvas = document.createElement("canvas");
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = "margin: 4px";
    //tensor를 image pixel로 변환하여 캔버스에 그린다.
    await tf.browser.toPixels(imageTensor, canvas); 
    //visor surface에 canvas를 추가
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