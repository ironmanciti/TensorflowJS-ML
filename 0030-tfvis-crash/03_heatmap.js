//heatmap

const cols = 50;
const rows = 20;
const values = [];
for (let i=0; i<cols; i++){
    const col = [];
    for (let j=0; j<rows; j++){
        col.push(i * j);
    }
    values.push(col);
}

const data1 = {values};   //20 X 50

//render to visor
const surface1 = {name: 'Heatmap', tab: 'Charts'};
tfvis.render.heatmap(surface1, data1);

const data2 = {
    values: [[4, 2, 8, 20], [1, 7, 2, 10], [3, 3, 20, 13]] , //3 X 4
    xTickLabels: ['치즈', '소고기', '계란'],
    yTickLabels: ['열량', '지방', '수분', '단백질']
}

//render to visor
const surface2 = {name: 'Heatmap of Custom Label', tab: 'Chart 2'};
tfvis.render.heatmap(surface2, data2);
