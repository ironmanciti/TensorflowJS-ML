async function run(){

    const model = await mobilenet.load();
    
    const video = document.getElementById('webcam');
    const webcamIterator = await tf.data.webcam(video);  
    console.log("webcam connected");
    
    while(true) {
        const img = await webcamIterator.capture();
        preds = await model.classify(img);
        
        document.getElementById('predictions').innerText = 
                    `prediction: ${preds[0].className} \n
                    probability: ${preds[0].probability.toFixed(4)}`
        img.dispose();
        await tf.nextFrame();
    }
}

document.addEventListener("DOMContentLoaded", run);  

