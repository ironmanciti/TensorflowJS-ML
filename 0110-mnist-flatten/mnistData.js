const TRAIN_TEST_SPLIT = 0.8;

const MNIST_IMAGES_SPRITE_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';

const MNIST_LABELS_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

export class MnistData {
    constructor() {
        
    }

    async load(){
        const labelRequest = fetch(MNIST_IMAGES_SPRITE_PATH);
        return labelRequest;
    }
}

const a = new MnistData();
a.load().then(result => console.log(result));