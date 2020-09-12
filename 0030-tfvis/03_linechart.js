//linechart
const series1 = [];
const series2 = [];
//big noise 추가
for (let i = 0; i < 100; i++) {
    series1.push({ x: i, y: i + Math.random() * 50 })
}
//small noise 추가
for (let i = 0; i < 100; i++) {
    series2.push({ x: i, y: i + Math.random() * 5 })
}

const surface = { name: "Line Chart", tab: "Charts" };
tfvis.render.linechart(surface, {
    values: [series1, series2],
    series: ["Large Noise", "Small Noise"]
});
