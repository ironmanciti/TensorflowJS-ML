const fs = require('fs');
const _ = require('lodash');

function extractColumns(data, columnNames) {
  const headers = _.first(data);

  const indexes = _.map(columnNames, column => headers.indexOf(column));
  const extracted = _.map(data, row => _.pullAt(row, indexes));

  return extracted;
}

module.exports = function loadCSV(
  filename,
  {
    dataColumns = [],
    labelColumns = []
  }
) {
  let data = fs.readFileSync(filename, { encoding: 'utf-8' });
  data = _.map(data.split('\n'), d => d.split(','));
  data = _.dropRightWhile(data, val => _.isEqual(val, ['']));
  const headers = _.first(data);

  data = _.map(data, (row, index) => {
    if (index === 0) {
      return row;
    }
    return _.map(row, (element, index) => {
      const result = parseFloat(element.replace('"', ''));
      return _.isNaN(result) ? element : result;
    });
  });

  let labels = extractColumns(data, labelColumns);
  data = extractColumns(data, dataColumns);

  //1st row 제거
  data.shift();
  labels.shift();

  return { features: data, labels };
};
