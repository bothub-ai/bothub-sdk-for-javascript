import * as path from 'path';
import * as Env from './env';

import { version } from '../package.json';

/** 项目版本号 */
export { version };

/** 生成定位到项目根目录的绝对路径 */
export function resolve(...paths: string[]) {
    return path.resolve(__dirname, '..', ...paths);
}

/**
 * Generate tag of build
 * @returns {string}
 */
function buildTag() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
}

/** 编译的版本号 */
export const build = buildTag();

/** 获取当前命令行参数 */
function getCommand() {
    /** 环境变量类型 */
    type EnvType = keyof typeof Env;

    // 命令行参数
    const result = {
        input: '',
        output: '',
        name: '',
        env: 'uat' as EnvType,
        mode: process.env.NODE_ENV as 'development' | 'production' | 'none',
    };

    /** 参数数组 */
    const args = process.argv.slice(2);
    /** 默认模式 */
    const defaultMode = (result.mode === 'development') ? 'uat' : 'prod';

    let entry = '';

    // 是否指定当前模式
    if (/(uat|prod)/.test(args[0])) {
        entry = args[1];
        result.env = args[0] as EnvType;
    }
    else {
        entry = args[0];
        result.env = defaultMode;
    }

    // 指定入口文件
    if (entry) {
        result.name = entry[0].toUpperCase() + entry.substring(1);
        result.input = resolve('src/special', entry, 'index.ts');
        result.output = path.join('special', `${entry}.js`);
    }
    else {
        result.name = 'Main';
        result.input = resolve('src/init/index.ts');
        result.output = result.mode === 'development' ? 'sdk.js' : `sdk-${version}.js`;
    }

    if (!/(uat)|(prod)/.test(result.env)) {
        throw new Error('只允许 uat、prod 两种环境变量');
    }

    return result;
}

/** 当前运行参数 */
export const command = getCommand();
