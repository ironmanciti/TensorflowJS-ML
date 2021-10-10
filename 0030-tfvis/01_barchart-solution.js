//bar chart
//toy data 생성
const data = [];
for (let i=1; i <= 5; i++){
    data.push({index: i, value: i * 50})
}
//bar chart 그리기
const surface = {name: 'Bar chart', tab: 'Charts'};
tfvis.render.barchart(surface, data, {
    xLabel: 'i',
    yLabel: 'i * 50'
});
