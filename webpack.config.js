const path = require('path');
const webpack = require('webpack');
const es3ifyPlugin = require('es3ify-webpack-plugin');

const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bothub.js",
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    // presets: ['env']
                    presets: [
                        'es2015',
                    ],
                    plugins: [
                        // 'transform-es3-member-expression-literals',
                        // 'transform-es3-property-literals',
                        // "transform-es5-property-mutators",
                        // ['transform-es2015-modules-commonjs', {"loose": true}],
                        // ["transform-es2015-for-of", {"loose": true}],
                        // ['transform-es3-modules-literals', {}],
                    ],
                }
            }
        }]
    },
    plugins: [
        new es3ifyPlugin(),
        // new PrepackWebpackPlugin({}),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
    ]
};