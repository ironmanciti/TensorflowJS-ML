//scatterplot
//toy data
const series1 = []
const series2 = []

for (let i=0; i<100; i++){
    series1.push({x: i, y: Math.random() * 100 - Math.random() * 50});
    series2.push({x: i, y: i})
}
//rendering
const surface = { name: 'Scatter Plot', tab: 'Charts' };
tfvis.render.scatterplot(surface, { 
            values: [series1, series2], 
            series:  ['Random', 'Linear']})
