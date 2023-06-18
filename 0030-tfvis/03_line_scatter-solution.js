//linechart

const series1 = Array(100).fill(0)
    .map(y => Math.random() * 100)
    .map((y, x) => ({x, y: x + y}))

const series2 = Array(100).fill(0)
    .map(y => Math.random() * 5)
    .map((y, x) => ({x, y: x + y}))


//line chart
const surface = {
    name: "Line Chart",
    tab: "선형 차트"
};
tfvis.render.linechart(surface, {
    values: [series1, series2],
    series: ["Large Noise", "Small Noise"]   //범례
});

//scatterplot
const surface2 = {
    name: "Scatter Plot",
    tab: "산점도"
};
tfvis.render.scatterplot(surface2, {
    values: [series1, series2],
    series: ["Large Noise", "Small Noise"]
});

