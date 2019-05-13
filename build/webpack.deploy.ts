process.env.NODE_ENV = 'production';

import chalk from 'chalk';
import webpack from 'webpack';
import baseConfig from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';
import GoogleCloudStorage from 'webpack-google-cloud-storage-plugin';

import { readdirSync } from 'fs';
import { join, parse, relative } from 'path';
import { output as dist } from './config';
import { resolve, version } from './utils';

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

baseConfig.performance = {
    hints: false,
    // 大小限制为 80Kb（单位为 bytes）
    maxAssetSize: 80000,
    maxEntrypointSize: 80000,
};

/**
 * 编译文件
 * @param {string} input 入口文件
 * @param {string} output 输出文件
 */
function compile(input: string, output: string): Promise<void> {
    return new Promise((then, reject) => {
        // 设置入口
        baseConfig.entry = input;
        // 设置输出
        baseConfig.output!.filename = output;

        webpack(baseConfig, (err) => {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }

            console.log(chalk.cyan(`Build complete '${output}'.`));

            then();
        });
    });
}

// 主流程
async function main() {
    const files: [string, string][] = [[resolve('src/init/index.ts'), `sdk-${version}.js`]];

    readdirSync(resolve('src/special')).forEach((file) => files.push([
        resolve(`src/special/${file}/index.ts`),
        `special/${file}.js`,
    ]));

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 最后一次编译设置上传
        if (i === files.length - 1) {
            baseConfig.plugins!.push(new GoogleCloudStorage({
                directory: dist,
                include: files.map(([, item]) => parse(item).base),
                storageOptions: {
                    projectId: 'bothub-1340',
                    keyFilename: resolve('gcloud.json'),
                },
                uploadOptions: {
                    gzip: true,
                    makePublic: true,
                    bucketName: 'sdk.bothub.ai',
                    destinationNameFn: (item: any) => join('dist', relative(dist, item.path)),
                },
            }));
        }

        await compile(...file);
    }

    console.log(chalk.cyan(`\nDeploy complete.\n`));
}

console.log('\x1Bc');
main();
