let mobilenet
let model
const webcam = new Webcam(document.getElementById('wc'));
const dataset = new RPSDataset();
let rockSamples = 0;
let paperSamples = 0;
let scissorsSamples = 0;

async function loadMobilenet(){
    const mobilenet = await 
        tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    //layer.output 이후 layer들은 ignore하는 new model 반환
    return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

function handleButton(elem){
    switch(elem.id){
        case "0":
            rockSamples ++;
            document.getElementById("rockSamples").innerText = "바위 sample 수: " + rockSamples;
            break;
        case "1":
            paperSamples ++;
            document.getElementById("paperSamples").innerText = "보 sample 수: " + paperSamples;
            break;
        case "2":
            scissorsSamples ++;
            document.getElementById("scissorsSamples").innerText = "가위 sample 수: " + scissorsSamples;
            break;
    }
    label = parseInt(elem.id)
    const img = webcam.capture();
    dataset.addExample(mobilenet.predict(img), label)
}

async function train(){
    dataset.ys = null;
    dataset.encodeLabels(3)
    model = tf.sequential({
        layers: [
            tf.layers.flatten({
                inputShape: mobilenet.outputs[0].shape.slice(1)
            }),
            tf.layers.dense({
                units: 100, activation: 'relu'
            }),
            tf.layers.dense({
                units: 3, activation: 'softmax'
            })
        ]
    })
    model.summary();

    console.log(dataset.xs, dataset.ys);

    const optimizer = tf.train.adam(0.0001);
    model.compile({optimizer:optimizer, loss: 'categoricalCrossentropy'});
    let loss = 0;
    model.fit(dataset.xs, dataset.ys, {
        epochs: 10,
        callbacks: {
            onBachEnd: async (batch, logs) => {
                loss = logs.loss.toFixed(5);
                console.log('LOSS: ', loss)
            }
        }
    })
}

async function predict() {
  while (isPredicting) {
    const predictedClass = tf.tidy(() => {
      const img = webcam.capture();
      const activation = mobilenet.predict(img);
      const predictions = model.predict(activation);
      return predictions.as1D().argMax();
    });
    const classId = (await predictedClass.data())[0];
    var predictionText = "";
    switch(classId){
		case 0:
			predictionText = "I see Rock";
			break;
		case 1:
			predictionText = "I see Paper";
			break;
		case 2:
			predictionText = "I see Scissors";
			break;
	}
	document.getElementById("prediction").innerText = predictionText;
			
    
    predictedClass.dispose();
    await tf.nextFrame();
  }
}

function doTraining(){
    console.log('train... begins')
	train();
    console.log('train ends')
}

function startPredicting(){
	isPredicting = true;
	predict();
}

function stopPredicting(){
	isPredicting = false;
	predict();
}

async function init(){
    await webcam.setup()
    mobilenet = await loadMobilenet();
    tf.tidy(() => mobilenet.predict(webcam.capture())); //tensor capture하여 mobilenet전달
}

init();