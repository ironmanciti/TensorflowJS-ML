//prediction
async function predict(){
    const threshold = 0.6;
    const input = document.getElementById("sentence").value;
    
    const model = await toxicity.load(threshold);
    console.log("model loaded");

    const predictions = await model.classify(input);
    console.log(predictions);
    for (i = 0; i < predictions.length; i++){
        if (predictions[i].results[0].match){
            document.getElementById("prediction").innerText = 
            `${predictions[i].label}` +
            " found with probability of " +
            `${predictions[i].results[0].probabilities[1].toFixed(4)}`
        } else {
            document.getElementById("prediction").innerText = "No insult ";
        }
    }
}
