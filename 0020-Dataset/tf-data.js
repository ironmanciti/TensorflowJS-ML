// //object로 이루어진 array 로부터 Dataset 생성
// //forEachAsync(f) - 데이터 세트의 모든 요소에 함수 적용
// async function run1(){
//     const myArray = [
//         {x: [1, 0, 9], y: 10},
//         {x: [5, 1, 3], y: 11},
//         {x: [1, 1, 9], y: 12}
//     ]

//     const myFirstData = tf.data.array(myArray);
//     await myFirstData.forEachAsync(e => console.log(e));
//     console.log("Array Dataset Print 완료")
// }
// run1();

// // CSV에서 Dataset 만들기
// async function run2(){
//     const host = window.location.host;
//     const url = "http://" + host + "/0020-Dataset/kc_house_data.csv";
//     console.log(url)

//     const csvDataset = tf.data.csv(url);

//     const data = await csvDataset.take(10).toArray();
//     console.log(data)

//     console.log(await csvDataset.columnNames());
//     const numCols = (await csvDataset.columnNames()).length;
//     console.log(`column 갯수 = ${numCols}`);

// }
// run2();

//CSV에서 필요한 column만 filtering
async function run3() {
  const HouseSalesDataset = tf.data.csv("kc_house_data.csv", {
    columnConfigs: {
      sqft_living: { isLabel: false },
      price: { isLabel: true }
    },
    configuredColumnsOnly: true
  });

  //csv 파일 읽기
  console.log("** CSV file =");
  console.log(await HouseSalesDataset.take(5).toArray());

  //시각화
  const dataPoints = await HouseSalesDataset.map(({xs, ys}) => ({
    x: xs.sqft_living,
    y: ys.price,
  })).toArray();

  console.log(dataPoints);
}

run3();







