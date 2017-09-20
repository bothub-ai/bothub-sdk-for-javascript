const path = require('path'),
    Es3ifyPlugin = require('es3ify-webpack-plugin');

module.exports = {
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        // path: path.resolve(__dirname, '../../../site-temp-file'),
        filename: 'bothub.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        'es2015',
                    ],
                    plugins: [
                        // 'transform-es3-member-expression-literals',
                        // 'transform-es3-property-literals',
                        // 'transform-es5-property-mutators',
                        // ['transform-es2015-modules-commonjs', {'loose': true}],
                        // ['transform-es2015-for-of', {'loose': true}],
                        // ['transform-es3-modules-literals', {}],
                    ],
                },
            },
        }],
    },
    plugins: [
        new Es3ifyPlugin(),
    ],
};
