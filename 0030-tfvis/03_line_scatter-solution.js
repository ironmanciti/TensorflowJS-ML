//선형 차트(Line Chart)와 산점도(Scatter Plot)를 생성
// 선형 차트에 사용될 두 개의 데이터 시리즈를 생성
// series1과 series2는 각각 100개의 무작위 값을 가지며, 이들의 y 값은 x 값에 따라 증가합니다.
const series1 = Array(100).fill(0)
    .map(y => Math.random() * 100)  // 0에서 100 사이의 무작위 값 생성
    .map((y, x) => ({x, y: x + y}))  // y 값에 x 값을 더해주며, x, y 쌍의 객체 생성

const series2 = Array(100).fill(0)
    .map(y => Math.random() * 5)  // 0에서 5 사이의 무작위 값 생성
    .map((y, x) => ({x, y: x + y}))  // y 값에 x 값을 더해주며, x, y 쌍의 객체 생성

// tfvis를 이용하여 선형 차트를 그립니다.
const surface = {
    name: "Line Chart",  // 차트의 이름
    tab: "선형 차트"  // tfvis의 탭 이름
};
tfvis.render.linechart(surface, {
    values: [series1, series2],  // 그래프에 표시될 데이터
    series: ["Large Noise", "Small Noise"]  // 각 데이터 시리즈의 범례
});

// tfvis를 이용하여 산점도를 그립니다.
const surface2 = {
    name: "Scatter Plot",  // 차트의 이름
    tab: "산점도"  // tfvis의 탭 이름
};
tfvis.render.scatterplot(surface2, {
    values: [series1, series2],  // 그래프에 표시될 데이터
    series: ["Large Noise", "Small Noise"]  // 각 데이터 시리즈의 범례
});

