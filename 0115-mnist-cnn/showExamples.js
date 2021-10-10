import {MnistData} from "./mnistData.js";

async function showExamples(data) {
  //25 개 sample 을 minstData.js 에서 가져오기
  

  //surface instance 생성
  

  // 25x784 인 examples.xs 를 25 개의 28x28x1 array 로 reshape 하여
  // 28x28 size canvas 에 draw
  
}

async function run() {
  const data = new MnistData();
  await data.load();
  //sample data 를 visor 상에 plot
  await showExamples(data);
}

document.addEventListener("DOMContentLoaded", run);