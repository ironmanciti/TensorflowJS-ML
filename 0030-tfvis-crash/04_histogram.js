//histogram
const data = Array(100).fill(0).map(x => Math.random() * 100 - Math.random() * 50);

//histogram 통계값 산출을 위해 special values 추가
data.push(Infinity);
data.push(NaN);
data.push(0);

const surface = {name: 'Histogram', tab: 'Charts'};
tfvis.render.histogram(surface, data, {maxBins: 20});
