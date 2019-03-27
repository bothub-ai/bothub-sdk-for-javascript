import * as path from 'path';

import { CompilerOptions } from 'typescript';

/** 生成定位到项目根目录的绝对路径 */
export function resolve(...paths: string[]) {
    return path.resolve(__dirname, '..', ...paths);
}

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
