//object로 이루어진 array 로부터 Dataset 생성
//forEachAsync(f) - 데이터 세트의 모든 요소에 함수 적용
// async function run1(){ // 비동기 작업을 처리하는 async 함수인 run1
//     const myArray = [ // JavaScript 객체를 element로 갖는 배열 myArray
//         {x: [1, 0, 9], y: 10},
//         {x: [5, 1, 3], y: 11},
//         {x: [1, 1, 9], y: 12}
//     ]

//     // myArray에서 tf.js 데이터셋 생성
//     const myFirstData = tf.data.array(myArray); 
//     // 데이터셋의 각 요소를 비동기적으로 콘솔에 출력
//     await myFirstData.forEachAsync(e => console.log(e)); 
//     console.log("Array Dataset Print 완료") 
// }
// run1(); 


// CSV에서 Dataset 만들기
// async function run2(){ 
//     const host = window.location.host; // 현재 웹 페이지의 호스트명
//     const url = "http://" + host + "/0020-Dataset/kc_house_data.csv"; // CSV 파일 URL 생성
//     console.log(url) 

//     const csvDataset = tf.data.csv(url); // CSV 파일에서 TensorFlow.js 데이터셋 생성

//     const data = await csvDataset.take(10).toArray(); //처음 10개 요소를 배열로 변환
//     console.log(data) // 변환된 배열을 콘솔에 출력

//     console.log(await csvDataset.columnNames()); // CSV 파일의 열 이름을 콘솔에 출력
//     const numCols = (await csvDataset.columnNames()).length; // CSV 파일의 열 개수 계산
//     console.log(`column 갯수 = ${numCols}`); // 계산된 열 개수를 콘솔에 출력
// }
// run2();


//CSV에서 필요한 column만 filtering
// async function run3() { 
//   // CSV 파일에서 TensorFlow.js 데이터셋을 생성
//   const HouseSalesDataset = tf.data.csv("kc_house_data.csv", { 
//     columnConfigs: { // 각 열에 대한 설정을 지정
//       sqft_living: { isLabel: false }, // "sqft_living" 열은 레이블이 아님 표시
//       price: { isLabel: true } // "price" 열은 레이블임을 표시
//     },
//     configuredColumnsOnly: true // 설정된 열만 사용하도록 지정
//   });

//   // csv 파일 읽기
//   console.log("** CSV file =");
//   // 처음 5개 요소를 배열로 변환하여 콘솔에 출력
//   console.log(await HouseSalesDataset.take(5).toArray()); 

//   // 시각화
//   // "sqft_living" 열의 값을 x로, "price" 열의 값을 y로 갖는 데이터 포인트를 생성
//   const dataPoints = await HouseSalesDataset.map(({xs, ys}) => ({ 
//     x: xs.sqft_living,
//     y: ys.price,
//   })).toArray();

//   console.log(dataPoints); 
// }

// run3(); 








