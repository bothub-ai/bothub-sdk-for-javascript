process.env.NODE_ENV = 'development';

import fs from 'fs';
import Webpack from 'webpack';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import { join } from 'path';
import { getType } from 'mime';
import { output } from './config';
import { resolve } from './utils';
import { createServer } from 'https';
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
            messages: [`Your application is already set at http://${host}:${port}/.\n`],
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

app.use((ctx: Context, next: Function) => {
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
        ctx.status = 405;
        ctx.length = 0;
        ctx.set('Allow', 'GET, HEAD');
        next();
        return (false);
    }

    const filePath = ctx.path[ctx.path.length - 1] === '/'
        ? join(output, ctx.path, 'index.html')
        : join(output, ctx.path);

    if (!fs.existsSync(filePath)) {
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
