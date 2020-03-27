async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  const model = await mobilenet.load();
  console.log('Sucessfully loaded model ...');

  // Make a prediction through the model on the image.
  const img = document.getElementById('img');
  const result = await model.classify(img);
  console.log(result);
  document.getElementById("result").innerText = 
    `prediction: ${result[0].className} \n
     probability: ${result[0].probability.toFixed(4)}`;
}

document.addEventListener("DOMContentLoaded", app);