//scatterplot
const series1 = Array(100).fill(0)
    .map(y => Math.random() * 100 - Math.random() * 50)
    .map((y, x) => ({ x, y, }));

const series2 = Array(100).fill(0)
    .map((y, i) => i + Math.random() * 5)
    .map((y, x) => ({ x, y, }));

const surface = { name: 'Scatter Plot', tab: 'Charts' };
const series = ['Random', 'Linear'];
tfvis.render.scatterplot(surface, { values: [series1, series2], series })



