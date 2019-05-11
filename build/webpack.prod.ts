process.env.NODE_ENV = 'production';

import chalk from 'chalk';
import webpack from 'webpack';
import baseConfig from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

if (!baseConfig.optimization) {
    baseConfig.optimization = {};
}

if (!baseConfig.optimization.minimizer) {
    baseConfig.optimization.minimizer = [];
}

baseConfig.devtool = false;

baseConfig.optimization.minimizer.push(
    new TerserPlugin({
        test: /\.js$/i,
        cache: false,
        terserOptions: {
            ecma: 5,
            ie8: false,
            safari10: false,
            output: {
                comments: /^!/,
            },
        },
    }),
);

// 包分析
baseConfig.plugins!.push(
    new BundleAnalyzerPlugin(),
);

baseConfig.performance = {
    hints: false,
    // 大小限制为 80Kb（单位为 bytes）
    maxAssetSize: 80000,
    maxEntrypointSize: 80000,
};

webpack(baseConfig, (err, stats) => {
    if (err) {
        throw err;
    }

    console.log('\x1Bc');

    console.log(stats.toString({
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        modules: false,
        children: false,
        hash: false,
        builtAt: false,
        timings: false,
        version: false,
    }));

    console.log(chalk.cyan('\n  Build complete.\n'));
});
