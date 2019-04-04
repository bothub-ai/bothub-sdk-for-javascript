process.env.NODE_ENV = 'development';

import Webpack from 'webpack';
import MemoryFS from 'memory-fs';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import { join } from 'path';
import { getType } from 'mime';
import { output } from './config';
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
const fs = compiler.outputFileSystem = new MemoryFS();
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Bothub SDK for JavaScript</title>
    <style>
        html,body {
            height: 100%;
            min-height: 2000px;
        }
    </style>
</head>
<body>
    <div class="page-container">
        <form action="/cart/add">
            <button type="submit" name="add">Add To Cart</button>
        </form>
    </div>
    <script>
        window.__st = { a: 27251026 }
    </script>
    <script src="/sdk.js"></script>
</body>
</html>`;

// 首页写入内存
fs.mkdirpSync(output);
fs.writeFileSync(join(output, 'index.html'), indexHtml);

compiler.watch(
    { ignored: /node_modules/ },
    (err?: Error) => (
        (err && console.error(err.stack || err)) ||
        (err && (err as any).details && console.error((err as any).details))
    ),
);

app.listen(port);

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

    ctx.type = getType(filePath)!;
    ctx.lastModified = new Date();

    ctx.set('Accept-Ranges', 'bytes');
    ctx.set('Cache-Control', 'max-age=0');

    ctx.length = Buffer.from(fs.readFileSync(filePath)).length;
    ctx.body = fs.createReadStream(filePath);

    next();
});
