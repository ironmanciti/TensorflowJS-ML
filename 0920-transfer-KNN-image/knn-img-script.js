async function app() {
    // Create the classifier.
    const classifier = knnClassifier.create();

    // Load mobilenet.
    const mobilenetModule = await mobilenet.load();

    //모든 class 에 대해 MobileNet 의 logit 을 knn classifier 에 example 로 add
    const img0 = tf.browser.fromPixels(document.getElementById('class0'));
    const logits0 = mobilenetModule.infer(img0, 'conv_preds');
    classifier.addExample(logits0, 0);
    classifier.addExample(logits0, 0);

    const img1 = tf.browser.fromPixels(document.getElementById('class1'));
    const logits1 = mobilenetModule.infer(img1, 'conv_preds');
    classifier.addExample(logits1, 1);
    classifier.addExample(logits1, 1);

    const img2 = tf.browser.fromPixels(document.getElementById('class2'));
    const logits2 = mobilenetModule.infer(img2, 'conv_preds');
    classifier.addExample(logits2, 2);
    classifier.addExample(logits2, 2);

    // test image 의 logit 을 구하여 다른 class example 들의 logit 과 유사도 측정
    const x = tf.browser.fromPixels(document.getElementById('test'));
    const xlogits = mobilenetModule.infer(x, 'conv_preds');
    console.log('Predictions:');
    // knn prediction
    const result = await classifier.predictClass(xlogits);
    console.log(result);
}

document.addEventListener("DOMContentLoaded", app);

