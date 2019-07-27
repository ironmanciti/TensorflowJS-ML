let truncatedMobileNet;
let webcamIterator;
const NUM_CLASSES = 4;
const BATCH_SIZE = 3;
const EPOCHS = 20;
let model;
let img;
let examples = {}
const classes = ['Up', 'Down', 'Left', 'Right'];

// Webcam 연결
const videoElement = document.getElementById('webcam');

const train = async () => {
    if (examples.ys == null) {
        document.getElementById("console").innerText = 'Example 이 없습니다.';
    }
    // model 구성
    // truncatedMobileNet + dense + dense(softmax)
    model = tf.sequential({
        layers: [
            tf.layers.flatten({
                inputShape: truncatedMobileNet.outputs[0].shape.slice(1) 
            }),  //[7, 7, 256]
            tf.layers.dense({
                units: 50,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.dense({
                units: NUM_CLASSES,
                kernelInitializer: 'varianceScaling',
                useBias: false,
                activation: 'softmax'
            })
        ]
    })

    const optimizer = tf.train.adam(0.0005);
    model.compile({
        optimizer: optimizer, 
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    const surface = { name: 'show.history live', tab: 'Training' };
    
    const history = [];

    model.fit(examples.xs, examples.ys, {
        batchSize: BATCH_SIZE,
        epochs: EPOCHS,
        callbacks: {
            onEpochEnd: (epoch, log) => {
                history.push(log);
                tfvis.show.history(surface, history, ['loss', 'acc']);
              }
        }
    })
}

async function predict(){
    while(true){
        const scaled = await getImage();
        // model 의 input 은 truncatedMobileNet 의 predict output 이다.
        const embedding = truncatedMobileNet.predict(scaled);
        const prediction = model.predict(embedding);
        
        // prediction 을 argMax
        const idx = prediction.as1D().argMax().dataSync()[0];
        document.getElementById("console").innerText = classes[idx];
        scaled.dispose();

        await tf.nextFrame();
    }
}

async function getImage(){
    img = await webcamIterator.capture();
    // normalization
    const scaled = tf.tidy(() => img.expandDims(0).toFloat().div(127).sub(1));
    img.dispose();
    return scaled
}

const addExample = async (label) => {
    const scaled = await getImage();
    // one-hot encoding
    const onehot = tf.tidy(() => tf.oneHot(tf.tensor1d([label]).toInt(), NUM_CLASSES));
    // training data 모으기
    if (examples.ys == null) {
        result = truncatedMobileNet.predict(scaled);
        examples.xs = result;
        examples.ys = onehot;
    } else {
        result = truncatedMobileNet.predict(scaled);
        examples.xs = examples.xs.concat(result);
        examples.ys = examples.ys.concat(onehot, 0);
    }

    // cumulative sum - axis 1
    let sample_sum = [0,0,0,0];
    let sample_arr = examples.ys.arraySync();  // tensor 를 array 로 반환

    for (let i=0; i < sample_sum.length; i++){
        for (let j=0; j < sample_arr.length; j++){
            sample_sum[i] += sample_arr[j][i];
        }
    }

    document.getElementById('message').innerText 
        = 'UP: ' + sample_sum[0] + '   Down: ' + sample_sum[1] + '   Left: '+
          sample_sum[2] + '   Right: ' +sample_sum[3];

    console.log(tf.memory().numTensors);
}

async function loadTruncatedMobileNet(){
    const mobilenet = await tf.loadLayersModel(
        'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
    );
    
    const layer = mobilenet.getLayer('conv_pw_13_relu');

    //console.log(mobilenet.inputs);  // [224, 224, 3]
    //console.log(layer.output);      // [7, 7, 256]

    return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

async function run(){
    webcamIterator = await tf.data.webcam(videoElement);
    truncatedMobileNet = await loadTruncatedMobileNet();

    document.getElementById('class-a').addEventListener('click', () => addExample(0));
    document.getElementById('class-b').addEventListener('click', () => addExample(1));
    document.getElementById('class-c').addEventListener('click', () => addExample(2));
    document.getElementById('class-d').addEventListener('click', () => addExample(3));
    document.getElementById('train').addEventListener('click', () => train());
    document.getElementById('predict').addEventListener('click', () => predict());

    document.getElementById("console").innerText = 'Model loading 완료 !! Data 추가 !!';
};

run();
