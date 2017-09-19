process.env.NODE_ENV = 'development';

const webpack = require('webpack'),
    baseConfig = require('./webpack.base');

console.log('  Start Compile:');

// webpack 编译器
const compiler = webpack(baseConfig);
compiler.watch(
    {
        ignored: /node_modules/,
    },
    (err, stats) => {
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
    }
);
