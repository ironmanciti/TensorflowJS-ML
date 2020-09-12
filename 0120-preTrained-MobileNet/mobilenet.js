async function app(){
    
    const model = await mobilenet.load();
    console.log("model loaded");

    const img = document.getElementById('img');
    const predictions = await model.classify(img);

    console.log('Predictions: ');
            console.log(predictions);
            document.getElementById("prediction").innerText = 
            `prediction: ${predictions[0].className} \n
             probability: ${predictions[0].probability.toFixed(4)}`
}

document.addEventListener("DOMContentLoaded", app);  