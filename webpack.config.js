const path = require('path');
const webpack = require('webpack');

const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, './public/dist'),
        filename: 'bothub.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['es3ify-loader', 'babel-loader'],
        }],
    },
    plugins: [],
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        })
    );
}

module.exports = config;
