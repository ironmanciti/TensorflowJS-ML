//linechart
const series1 = [];
const series2 = [];
//big noise 추가
for (let i = 0; i < 100; i++) {
    series1.push({
        x: i,
        y: i + Math.random() * 100
    })
}
//small noise 추가
for (let i = 0; i < 100; i++) {
    series2.push({
        x: i,
        y: i + Math.random() * 5
    })
}
//line chart
const surface = {
    name: "Line Chart",
    tab: "선형 차트"
};
tfvis.render.linechart(surface, {
    values: [series1, series2],
    series: ["Large Noise", "Small Noise"]
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

