import { debug } from 'src/store';

/**
 * 控制台中输出日志
 *  - 只有调试模式才有效
 */
export function log(text: string) {
    if (debug) {
        console.log(`(Bothub) ${text}.`);
    }
}
