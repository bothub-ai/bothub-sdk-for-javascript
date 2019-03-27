process.env.NODE_MODE = 'production';

import chalk from 'chalk';
import webpack from 'webpack';
import baseConfig from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';
import GoogleCloudStorage from 'webpack-google-cloud-storage-plugin';

import { join } from 'path';
import { resolve } from './utils';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** 是否上传 */
const isDeploy = process.argv[3] === '--deploy';

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

// 需要上传，则添加上传插件
if (isDeploy) {
    baseConfig.plugins!.push(
        new GoogleCloudStorage({
            directory: './dist/',
            include: ['.*'],
            storageOptions: {
                projectId: 'bothub-1340',
                keyFilename: resolve('gcloud.json'),
            },
            uploadOptions: {
                gzip: true,
                makePublic: true,
                bucketName: 'assets.cartsbot.com',
                destinationNameFn: ({ path }: any) => {
                    return join('shopify/', path.replace('dist/', ''));
                },
            },
        }),
    );
}
// 不上传，则添加包分析插件
else {
    baseConfig.plugins!.push(
        new BundleAnalyzerPlugin(),
    );
}

baseConfig.performance = {
    hints: false,
    // 以下两个选项单位为 bytes
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
    }));

    console.log(chalk.cyan('\n  Build complete.\n'));
});
