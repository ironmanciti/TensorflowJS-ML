//confusion matrix

const rows = 5;
const cols = 5;
const values = [];

for (let i=0; i<rows; i++){
    const row = [];
    for (let j=0; j<cols; j++){
        row.push(Math.floor(Math.random() * 50));
    }
    values.push(row);
}

const data = {values};

//render to visor
const surface = {name: 'Confusion Matrix', tab: 'Charts'};
tfvis.render.confusionMatrix(surface, data, {shadeDiagonal: false});




