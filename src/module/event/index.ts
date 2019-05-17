/**
 * 应用事件模块
 *
 * @description
 *   该模块为 facebook 应用事件模块的再封装。
 *   有几点需要特别强调一下：
 *     - 所有事件均以`logEvent`函数为核心
 *     - 封装好的标准事件都有特定的参数和名称，类型都是定好的，这一点请查阅文档
 *
 * @link
 *   https://developers.facebook.com/docs/reference/javascript/FB.AppEvents.LogEvent
 */

export * from './standard';
export * from './custom';
export * from './core';

import * as Custom from './custom';
import * as Standard from './standard';

import { shallowCopyExclude } from 'src/lib/object';

export default {
    ...shallowCopyExclude(Custom, ['BhEventName', 'logCustom']),
    ...Standard,
    logEvent: Custom.logCustom,
};
