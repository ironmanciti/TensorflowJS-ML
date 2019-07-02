const path = require('path')

module.exports = {
    entry: {
        index: './script.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    module: {
        rules: [{test: /\.js/,
                exclude: /node_modules/,
                }]
    }
}