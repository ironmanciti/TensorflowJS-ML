trace1 = {
    x:[1,2,3,4], 
    y:[10,15,13,17],
    name: 'data1',
    mode:'markers',
    type: 'scatter',
    marker: {symbol: "circle", size:8}
}
trace2 = {
    x:[2,3,4,5], 
    y:[16,5,11,9],
    name: 'data2',
    mode: 'lines',
    type:'scatter',
}
trace3 = {
    x: [1,2,3,4],
    y: [12,9,15,12],
    name: 'data3',
    mode: 'lines+markers',
    type: 'scatter',
    marker: {symbol: "triangle-up", size:15}
}

data = [trace1, trace2, trace3]

//Plotly.newPlot(graphDiv, data, layout)
Plotly.newPlot('myDiv1', data, 
    { 
        width:700,
        title:'Line and Scatter Plot',
        xaxis: {
            title: 'X-축'
        },
        yaxis: {
            title: 'Y-축'
        }
    }
);

// restyle a single trace using attribute strings
var update0 = {
    opacity: 0.4,
    'marker.color': 'red'
};
var update1 = {
    opacity: 0.2,
    'marker.color': 'green'
};
// Plotly.restyle(graphDiv, update [, traceIndices])
Plotly.restyle('myDiv1', update0, 0);
Plotly.restyle('myDiv1', update1, 2);