async function app() {
    // Create the knnModel.
    const knnModel = knnClassifier.create();

    // Load mobilenet.
    const mobilenetModule = await mobilenet.load();

    function add_examples(logit, id){
        for (let i=0; i < 5; i++){
            knnModel.addExample(logit, id);
        }
    }

    //모든 class 에 대해 MobileNet 의 logit 을 knnModel 에 example 로 add
    const img0 = tf.browser.fromPixels(document.getElementById('class0'));
    let logits = mobilenetModule.infer(img0);
    add_examples(logits, 0);

    const img1 = tf.browser.fromPixels(document.getElementById('class1'));
    logits = mobilenetModule.infer(img1);
    add_examples(logits, 1);

    const img2 = tf.browser.fromPixels(document.getElementById('class2'));
    logits = mobilenetModule.infer(img2);
    add_examples(logits, 2);

    // test image 의 logit 을 구하여 다른 class example 들의 logit 과 유사도 측정
    const x = tf.browser.fromPixels(document.getElementById('test'));
    const xlogits = mobilenetModule.infer(x);
    // knn prediction
    const result = await knnModel.predictClass(xlogits);
    console.log(result);
    document.getElementById('predictions').innerText = 
                    `\nprediction: ${result.label} \n
                    probability: ${result.confidences[result.classIndex].toFixed(2)}`
}

document.addEventListener("DOMContentLoaded", app);

