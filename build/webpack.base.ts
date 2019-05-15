import Webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import * as env from './env';

import { output } from './config';
import { resolve, build, version, command } from './utils';

const Env = env[command.env];

type WebpackConfig = GetArrayItem<Parameters<typeof Webpack>[0]>;

const baseConfig: WebpackConfig = {
    mode: process.env.NODE_ENV as WebpackConfig['mode'],
    entry: command.input,
    output: {
        path: output,
        filename: command.output,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.less', '.css'],
        mainFiles: ['index.tsx', 'index.ts', 'index.js', 'index.less', 'index.css'],
        alias: {
            src: resolve('src'),
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
            banner: (
                'Project: Bothub SDK for JavaScript' +
                (command.name === 'Main' ? '\n' : ` - ${command.name}\n` ) +
                `Author: ${new Date().getFullYear()} © Bothub\n` +
                `Build: ${build}\nVersion: ${version}`
            ),
            entryOnly: false,
        }),
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.api': JSON.stringify(Env.api_server),
            'process.env.appId': JSON.stringify(Env.messenger_app_id),
            'process.env.sdkHref': JSON.stringify(Env.sdk_href),
        }),
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
    ],
};

export default baseConfig;
