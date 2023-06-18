// //** bar chart
//toy data 생성
const data = [
   { index: 0, value: 50 },
   { index: 1, value: 100 },
   { index: 2, value: 150 },
  ];

// const data = [];
// for (let i=1; i <= 5; i++){
//     data.push({index: i, value: i * 50})
// }

//bar chart 그리기
const surface = {name: 'Bar chart', tab: 'Charts'};
tfvis.render.barchart(surface, data, {
    xLabel: 'x-value',
    yLabel: 'y-value'
});
