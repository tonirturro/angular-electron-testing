const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const helpers = require('./helpers');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.htm$/,
                use: ["html-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                exclude: /\.component.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.component.css$/,
                use: ['raw-loader']
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg)$/,
                use: 'file-loader'
            },
            {
                test: /\.component.ng2.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true
                    }
                }, 'angular2-template-loader']
            },
            {
                test: /\.ts$/,
                exclude:  /\.component.ng2.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    plugins: [
        new WebpackBar(),
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)fesm5/,
            helpers.root('./src'),
            {}
        ),
        new FilterWarningsPlugin({
            exclude: /System.import/
        })
    ],
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    }
}