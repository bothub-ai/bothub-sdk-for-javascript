import Webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import * as env from './env';

import { output } from './config';
import { resolve, version, command } from './utils';

const Env = env[command.env];

type WebpackConfig = GetArrayItem<Parameters<typeof Webpack>[0]>;

const baseConfig: WebpackConfig = {
    mode: Env.mode,
    entry: resolve('src', command.project, 'index.ts'),
    output: {
        path: output,
        filename: `${command.project}.js`,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.json', '.less', '.css'],
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.less', 'index.css'],
        alias: {
            '^src': resolve('src', command.project),
            '^utils': resolve('src/utils'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: resolve('tsconfig.build.json'),
                },
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader'],
            },
        ],
    },
    plugins: [
        new ProgressBarPlugin({ width: 40 }),
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new Webpack.BannerPlugin({
            banner: `Project: Shopify Cartsbot Plugin\nAuthor: ${new Date().getFullYear()} © Bothub\nBuild: ${version}`,
            entryOnly: false,
        }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(Env.mode),
            'process.env.api': JSON.stringify(Env.api_server),
            'process.env.appId': JSON.stringify(Env.messenger_app_id),
        }),
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 4,
        }),
    ],
};

export default baseConfig;
