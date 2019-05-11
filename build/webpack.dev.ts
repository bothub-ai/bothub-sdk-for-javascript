process.env.NODE_ENV = 'development';

import fs from 'fs';
import Webpack from 'webpack';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import { join } from 'path';
import { getType } from 'mime';
import { output } from './config';
import { createServer } from 'https';
import { resolve, command } from './utils';
import { default as Koa, Context } from 'koa';

import baseConfig from './webpack.base';

const host = 'localhost';
const port = 8080;
const app = new Koa();

// 每个模块用 eval() 执行, SourceMap 作为 DataUrl 添加到文件末尾
baseConfig.devtool = 'eval-source-map';
// 调试用的插件
baseConfig.plugins!.push(
    new Webpack.NamedModulesPlugin(),
    new Webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: [
                (command.name === 'Main')
                    ? `Your application is already set at http://${host}:${port}/.\n`
                    : `${command.name} compile complete.`,
            ],
            notes: [],
        },
    }),
);

const compiler = Webpack(baseConfig);

compiler.watch(
    { ignored: /node_modules/ },
    (err?: Error) => (
        (err && console.error(err.stack || err)) ||
        (err && (err as any).details && console.error((err as any).details))
    ),
);

// 只有主进程才启动服务器
if (command.name === 'Main') {
    app.use((ctx: Context, next: Function) => {
        if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
            ctx.status = 405;
            ctx.length = 0;
            ctx.set('Allow', 'GET, HEAD');
            next();
            return (false);
        }

        const findPath = (path: string) => {
            const extensions = ['', 'index.html'];

            return (
                extensions
                    .map((item) => join(output, path, item))
                    .find((item) => fs.existsSync(item) && !fs.statSync(item).isDirectory())
            );
        };

        const filePath = findPath(ctx.path);

        if (!filePath) {
            ctx.status = 404;
            ctx.length = 0;
            next();
            return (false);
        }

        const fileStat = fs.statSync(filePath);

        ctx.type = getType(filePath)!;
        ctx.lastModified = new Date();

        ctx.set('Accept-Ranges', 'bytes');
        ctx.set('Cache-Control', 'max-age=0');

        ctx.length = fileStat.size;
        ctx.body = fs.createReadStream(filePath);

        next();
    });

    const options = {
        key: fs.readFileSync(resolve('cert/key.pem')),
        cert: fs.readFileSync(resolve('cert/cert.pem')),
    };

    createServer(options, app.callback()).listen(port);
}
