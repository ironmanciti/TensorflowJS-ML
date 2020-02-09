const tf = require('@tensorflow/tfjs');
const path = require('path')

const HouseSalesDataset = tf.data.csv(
    'file://' + path.join(__dirname, 'kc_house_data.csv'), {
    columnConfigs: {
        sqft_living: {
            isLabel: false
        },
        price: {
            isLabel: true
        }
    },
    configuredColumnsOnly: true
});

async function run(){
    await HouseSalesDataset.take(10).forEachAsync(e => console.log(e));
}

run();

