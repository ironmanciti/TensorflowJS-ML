import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import $ from 'jquery';

const arr_x = [-1, -2,  0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 6]
const arr_y = [-1, -2, -1, 1, 1, 0, 2, 3, 1, 3, 2, 4, 3, 6, 5]

let zip = (arr1, arr2) => arr1.map((x, i) => { return {'x':x, 'y':arr2[i]}})
const toy_data = zip(arr_x, arr_y)

//TFJS-VIS-1
let data = { values: [toy_data], series: ['toy data'] }

const container1 = document.getElementById('scatter-tfjs-1')

tfvis.render.scatterplot(container1, data, { width: 500, height: 400 })

//TFJS-VIS VISOR
const surface = { name: 'Scatterplot-tfjs', tab: 'Charts'}
tfvis.render.scatterplot(surface, data)

const x = tf.tensor2d(arr_x, [15, 1])
const y = tf.tensor2d(arr_y, [15, 1])

let model = tf.sequential()

function viewPrediction(model){    
    let t_pred = model.predict(x)
    let y_pred = t_pred.dataSync()
    let ar_pred = zip(arr_x, y_pred)
    
    //TFJS-VIS-1
    data = { values: [toy_data, ar_pred], series: ['toy data', 'prediction'] }

    tfvis.render.scatterplot(container1, data, { width: 500, height: 400 }) 
}

$('#init-btn').click(function() {
    model.add(tf.layers.dense({units: 1, inputShape: [1]}))
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'})

    viewPrediction(model)
    $('#train-btn').prop('disabled', false)
})

$('#train-btn').click(function() {    

    let msg = $('#msg');
    msg.text('Training, please wait...')    
    
    model.fit(x, y, {epochs: 20}).then((hist) => {    
        let mse = model.evaluate(x, y)
        
        viewPrediction(model)
        
        msg.text('MSE: '+mse.dataSync())

        $('#predict-btn').prop('disabled', false)
        
        const surface = { name: 'Training History', tab: 'MSE' }    
        tfvis.show.history(surface, hist, ['loss'])        
    })
})

$('#predict-btn').click(function() {
    var num = parseFloat($('#inputValue').val())
    let y_pred = model.predict(tf.tensor2d([num], [1,1]))
    $('#result').text(y_pred.dataSync())
})
