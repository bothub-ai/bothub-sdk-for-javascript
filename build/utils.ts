import * as path from 'path';
import * as Env from './env';

import { CompilerOptions } from 'typescript';

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
export const version = buildTag();

/** tsconfig.json 文件接口 */
interface TsConfig {
    compilerOptions: CompilerOptions;
    include?: string[];
    exclude?: string[];
    extends?: string;
}

/**
 * 编译 tsconfig 文件
 *  - 相对路径全部转换成绝对路径
 * @param {string} cwd 项目根路径
 * @param {TsConfig} baseConfig 配置选项
 */
export function parseTsconfig(cwd: string, baseConfig: TsConfig) {
    // 不存在扩展属性，则直接输出
    if (!baseConfig.extends) {
        return { ...baseConfig };
    }

    // 扩展属性
    const base = { ...baseConfig };
    const extend = require(resolve(cwd, base.extends!));

    delete base.extends;

    base.compilerOptions = {
        ...(extend.compilerOptions || {}),
        ...base.compilerOptions,
    };

    base.compilerOptions.outDir = resolve(cwd, base.compilerOptions.outDir || '');
    base.compilerOptions.baseUrl = resolve(cwd, base.compilerOptions.baseUrl || '');

    if (base.include) {
        base.include = base.include.map((dir) => resolve(cwd, dir));
    }
    if (base.exclude) {
        base.exclude = base.exclude.map((dir) => resolve(cwd, dir));
    }

    return base;
}

/** 获取当前命令行参数 */
function getCommand() {
    const args = process.argv.slice(2, 4);
    const Mode = process.argv[2] || '';

    type EnvType = keyof typeof Env;

    // 命令行参数
    const result = {
        isDeploy: false,
        project: 'bothub',
        env: 'uat' as EnvType,
        mode: process.env.NODE_ENV as 'development' | 'production' | 'none',
    };

    // 上传
    if (args[0] === '--deploy') {
        result.isDeploy = true;
        result.project = args[1];
        result.env = args[2] as EnvType;
    }
    // 构建或调试
    else {
        result.isDeploy = false;
        result.project = args[0];
        result.env = args[1] as EnvType;
    }

    if (!/(uat2?)|(prod)/.test(result.env)) {
        throw new Error('只允许 uat、uat2、prod 三种环境变量');
    }

    if (!/bothub|discount/.test(result.project)) {
        throw new Error('只允许 bothub、discount 两个项目');
    }

    return result;
}

/** 当前运行参数 */
export const command = getCommand();
