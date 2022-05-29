// //* object로 이루어진 array 로부터 Dataset 생성
// //* forEachAsync(f) - 데이터 세트의 모든 요소에 함수 적용
// async function run1(){
//     const myArray = [
//         {x: [1, 0, 9], y: 10},
//         {x: [5, 1, 3], y: 11},
//         {x: [1, 1, 9], y: 12}
//     ]

//     const myFirstData = tf.data.array(myArray);
//     await myFirstData.forEachAsync(e => console.log(e));
// }
// run1();

//  //*Create a Dataset from CSV
// async function run2(){
   
//     // const url =
//     //     'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';
//     const host = window.location.host;
//     const url = "http://" + host + "/0020-Dataset/boston-housing-train.csv";

//     const HouseSales = tf.data.csv(
//         url, {
//             columnConfig: {
//                 medv: {
//                     isLabel: true
//                 }
//             },
//         });

//     // Prepare the Dataset for training.
//     const flattenedDataset =
//         HouseSales
//         .map(({xs, ys}) => {
//             // Convert xs(features) and ys(labels) 
//             return {
//                 xs: Object.values(xs),
//                 ys: Object.values(ys)
//             };
//         })
//         .batch(10);

//     console.log(flattenedDataset);
// }
// run2();

// //** category 변수의 one-hot-encoding
// async function run3(){
//     const myArray = [
//         {x: [1, 0], y: 0},
//         {x: [5, 1], y: 1},
//         {x: [1, 1], y: 2}
//     ]

//     //label 생성
//     const labels = myArray.map(v => v.y) 
//     console.log(labels)

//     //one-hot-encoding
//     let labelTensor = tf.tensor1d(labels, "int32");
//     labelTensor = tf.oneHot(labels, 3);
//     console.log(labelTensor.arraySync())

// }
// run3();





