//bar chart
const data = [];
for (let i=1; i <= 5; i++){
    data.push({index: i, value: i * 50})
}
//visualize
const surface = {name: 'Bar chart', tab: 'Charts'};
tfvis.render.barchart(surface, data);
