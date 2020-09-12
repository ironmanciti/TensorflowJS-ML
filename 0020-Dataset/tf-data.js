async function run1(){
    const myArray = [
        {xs: [1, 0, 9], ys: 10},
        {xs: [5, 1, 3], ys: 11},
        {xs: [1, 1, 9], ys: 12}
    ]
    // array of objects 로부터 Dataset 생성
    const myFirstData = tf.data.array(myArray);
    console.log(myFirstData)
    await myFirstData.forEachAsync(e => console.log(e));
}

//Create a Dataset from CSV
const csvUrl =
'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

const HouseSalesDataset = tf.data.csv(
    csvUrl, {
    columnConfigs: {
        medv: {
            isLabel: true
          }
    },
});

async function run2(){
    await HouseSalesDataset.take(10).forEachAsync(e => console.log(e));
}

//run1();
run2();
