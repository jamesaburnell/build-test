const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CopyAndFlattenPlugin = require('./plugins/copy-and-flatten.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = env => ({
    entry: {
        app: ['./src/app.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: env.NODE_ENV,
    module: {
        rules: [
            { 
                test: /\.(js|jsx)$/, 
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                loader: 'babel-loader',
            }
        ]
    },
    resolve: {
        modules: [ 'node_modules' ]
    },
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        },
        port: '10001',
        host: '0.0.0.0',
        contentBase: path.resolve(__dirname, 'dist'), 
        compress: true,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({template: './index.html'}),
        new CopyAndFlattenPlugin({
            dir: 'src/assets',
            type: 'flatten'
        }),
        new ImageminPlugin({
            disable: !env.production,
            test: /\.(jpe?g|png|gif|svg)$/i
        })
    ]
});