//linechart
const series1 = [];
for (let i=0; i< 100; i++){
    series1.push({x: i, y: i + Math.random()*50});
}

const series2 = [];
for (let i=0; i< 100; i++){
    series2.push({x: i, y: i + Math.random()*5});
}

const surface = {name: 'Line Chart', tab: 'Charts'};
const series = ['First', 'Second']
const data = {values: [series1, series2], series}
tfvis.render.linechart(surface, data);
