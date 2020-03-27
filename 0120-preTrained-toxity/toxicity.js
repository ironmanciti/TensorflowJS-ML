function predict() {
  const threshold = 0.6;
  const input = document.getElementById("sentence").value;
  console.log("toxicity model loading...");
  toxicity.load(threshold).then(model => {
    const sentence = [input];
    model.classify(sentence).then(predictions => {
      console.log(predictions);
      for (i = 0; i < predictions.length; i++) {
        if (predictions[i].results[0].match) {
          console.log(
            predictions[i].label +
              " found with probability of " +
              predictions[i].results[0].probabilities[1].toFixed(4)
          );
        }
      }
    });
  });
}
