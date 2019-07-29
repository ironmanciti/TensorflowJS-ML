let net;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('img');
  const result = await net.classify(imgEl);
  console.log(result);
  document.getElementById("result").innerText = `
    prediction: ${result[0].className} \n
    probability: ${result[0].probability.toFixed(2)}
  `;
}

app();