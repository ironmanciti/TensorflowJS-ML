//scatterplot
const series1 = Array(100).fill(0)
        .map(y => Math.random() * 100 - Math.random() * 50)
        .map((y, x) => ({x, y,}));

const series = ['Random', 'Linear'];
const series2 = [];
for (let i=0; i< 100; i++){
    series2.push({x: i, y: i + Math.random()*50});
}

const surface = {name: 'Scatter Plot', tab: 'Charts'};
tfvis.render.scatterplot(surface, {values: [series1, series2], series})
        


