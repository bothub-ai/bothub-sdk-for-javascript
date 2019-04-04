import { resolve } from './utils';
import { compilerOptions } from '../tsconfig.json';

/** 输出文件夹 */
export const output = resolve(compilerOptions.outDir);
