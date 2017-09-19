process.env.NODE_ENV = 'production';

const shell = require('shelljs'),
    webpack = require('webpack'),
    baseConfig = require('./webpack.base');

baseConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    })
);

console.log('  Start Build:');
shell.rm('-rf', './dist');

const compiler = webpack(baseConfig);
compiler.run((err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }

    const info = stats.toJson();
    if (stats.hasErrors()) {
        console.error(info.errors);
    }
    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }

    console.log(stats.toString({
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        modules: false,
        children: false,
    }));
});
