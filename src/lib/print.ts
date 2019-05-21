import { getQueryString } from 'src/lib/http';

const prefix = '(Bothub SDK)';
const debug = getQueryString('bothubDebugMode') === 'true';

/**
 * 控制台中输出`info`日志
 *  - 只有调试模式才有效
 */
export function log(text: string) {
    if (debug) {
        console.log(`${prefix} ${text}.`);
    }
}

/**
 * 控制台中输出`warn`日志
 * @param {string} text 日志文本
 * @param {boolean} [isDebug] 该日志是否只在调试模式下有效
 */
export function warn(text: string, isDebug = false) {
    const context = `${prefix} ${text}.`;

    if (isDebug) {
        if (debug) {
            console.warn(context);
        }
    }
    else {
        console.warn(context);
    }
}

export function error(text: string) {

}
