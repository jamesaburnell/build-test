const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CopyAndFlattenPlugin = require('./plugins/copy-and-flatten.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
    devtool: 'source-map',
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
        // new UglifyJsPlugin(),
        new HtmlWebpackPlugin({template: './index.html'}),
        new CopyWebpackPlugin([
            {
                from: 'src/assets/**/*',
                to: '[folder]_[name].[ext]',
                test: /([^/]+)\/(.+)\.png$/
            }
        ], {ignore: [ '*.js', '*.css' ]}),
        new CopyAndFlattenPlugin()
    ]
});