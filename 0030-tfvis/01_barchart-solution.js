// //** bar chart
// toy data 생성
const data = [
  // 첫 번째 바의 데이터. x 값(인덱스)은 0이고 y 값(값)은 50입니다.
  // 두 번째 바의 데이터. x 값(인덱스)은 1이고 y 값(값)은 100입니다.
  // 세 번째 바의 데이터. x 값(인덱스)은 2이고 y 값(값)은 150입니다.
   { index: 0, value: 50 },  
   { index: 1, value: 100 }, 
   { index: 2, value: 150 }, 
];

// 1부터 5까지의 인덱스와 그에 따라 증가하는 값을 가진 데이터를 생성
// const data = [];
// for (let i=1; i <= 5; i++){
//     data.push({index: i, value: i * 50})
// }

//bar chart 그리기
const surface = {name: 'Bar chart', tab: 'Charts'}; // tfvis에 표시할 차트와 탭 지정
tfvis.render.barchart(surface, data, {  // 바 차트를 그리기
    xLabel: 'x-value', // x축의 레이블을 'x-value'로 설정
    yLabel: 'y-value'  // y축의 레이블을 'y-value'로 설정
});
