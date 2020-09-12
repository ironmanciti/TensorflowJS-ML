async function app(){

    const model = await mobilenet.load();
    console.log("model loaded");
    
    const video = document.getElementById('webcam');
    const webcamIterator = await tf.data.webcam(video);  
    console.log("webcam connected");
    
    while(true) {
        const img = await webcamIterator.capture();
        const predictions = await model.classify(img);
        document.getElementById("prediction").innerText = 
                    `prediction: ${predictions[0].className} \n
                    probability: ${predictions[0].probability.toFixed(4)}`
        img.dispose();
        await tf.nextFrame();
    }
}

document.addEventListener("DOMContentLoaded", app);  