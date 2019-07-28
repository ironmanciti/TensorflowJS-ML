const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const loadCSV = require('../utils/load-csv');
const path = require("path");

//k-nearest neighbor using tfjs
function knn(features, labels, predictionPoint, k){
    //standardization
    const {mean, variance} = tf.moments(features, axis=0);
    const scaledFeatures = features.sub(mean).div(tf.sqrt(variance));
    const scaledPoint = predictionPoint.sub(mean).div(tf.sqrt(variance));

    const result = scaledFeatures              // [[-0.3549276, -0.2953521, -0.9798356]
                    .sub(scaledPoint)          //  [1.5141413 , -0.4402111, 1.5134664 ]
                    .pow(2)               //(X - p)^2 --> [2.292624 , 0.1937858 , 2.2905805  ],
                    .sum(1, keepDims=true)    //(x1-p)^2 + (x2-p)^2 + (x3-p)^2 --> [4.7769904  ]
                    .pow(0.5)               //square root --> 각 feature 와 p 간의 거리 [2.1856327 ]
                    .concat(labels, axis=1) //계산한 거리와 실제값 concat [2.1856327 , 538000 ]
                    .unstack()           // R rank 를 R-1 rank 의 list 로 변환 --> [2.0646284, 320000]
                    .sort((a, b) => a > b ? 1:-1) //오름차순 정렬
                    .slice(0, k)            //top k 개 [ 0.04693511128425598, 260000 ]
                    .reduce((acc, pair) => acc + pair.dataSync()[1], 0) / k;

   return result;
}
// csv data read
let {features, labels} = loadCSV(path.join(__dirname,'kc_house_data.csv'), {
    dataColumns: ['lat', 'long', 'sqft_living'],
    labelColumns: ['price']
});

// console.log(features)
// console.log(labels)
// [ [ 47.5112, -122.257, 1180 ], 
//   [ 47.721, -122.319, 2570 ],  
// [[221900 ],
//  [538000 ],
// feature, label 을 tensor 로 변환
const featureTensors = tf.tensor2d(features, [features.length, 3]);
const labelTensors = tf.tensor2d(labels, [labels.length, 1]);
// train, test set split
const testLen = 2;  // 검증 data
const trainLen = featureTensors.shape[0] - testLen;
const [X_train, X_test] = tf.split(featureTensors, [trainLen, testLen]);
const [y_train, y_test] = tf.split(labelTensors, [trainLen, testLen]);

//prediction data 를 k-nearest regression 예측
const predictions = [];

X_test.arraySync().forEach((point, i) => {
    //k-nearest prediction
    const result = knn(X_train, y_train, tf.tensor(point), 10);
    predictions.push(result);
    // label data
    const label = y_test.arraySync()[i][0];   
    // accuracy 계산
    const err = ((label - result) / label * 100).toFixed(2);
    console.log(`label ${label} ==> result ${result}, error rate = ${err}%`);
})


//knn(featureTensors, labelTensors, tf.tensor2d([ 47.5112, -122.257, 1180 ], [1,3]), 5);