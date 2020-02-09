// Table
const headers = ['Col1', 'Col2', 'Col3'];
const values = [[1, 2, 3], ['4', '5', '6'], ['<strong>7</strong>', true, false]];

const surface = {name: 'Table', tab: 'Charts'};
tfvis.render.table(surface, {headers, values});

