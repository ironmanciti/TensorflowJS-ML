const a = 2;
const b = 3;

data = {
    x:[0, 10], 
    y:[b, a * 10 + b],
    name: 'linear model',
    mode:'lines'
}

//Plotly.newPlot(graphDiv, data, layout)
Plotly.newPlot('myDiv1', [data], 
    { 
        width:700,
        title:'Simple Linear Plot',
        xaxis: {
            title: 'X-축'
        },
        yaxis: {
            title: 'Y-축'
        }
    }
);

