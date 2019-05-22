import { isDef } from 'src/lib/assert';
import { getQueryString } from 'src/lib/http';
import { InputWidgetData, WidgetData, Widget, setConfig } from 'src/widget';

import * as user from 'src/module/user';

/** 是否是调试模式 */
const debug = getQueryString('bothubDebugMode') === 'true';

/** APP 编号 */
export let messengerAppId = process.env.appId as string;
/** 用户连接的 facebook 页面编号 */
export let pageId = '';
/** 是否不记录 Facebook 事件 */
export let noFacebookLogEvent = false;
/** 语言类型 */
export let language: 'zh_CN' | 'zh_TW' | 'en_US' = 'en_US';
/** 是否在初始化后立即渲染 */
export let renderImmediately = true;

/** 插件配置原始数据 */
export const widgetData: WidgetData[] = [];
/** 页面上的所有插件 */
export const widgets: Widget[] = [];

/** 初始化参数 */
interface BothubInitParams {
    /** 用户连接的 facebook 页面编号 */
    pageId: typeof pageId;
    /** APP 编号（`debug`选项为`true`时才会生效） */
    appId?: typeof messengerAppId;
    /** 自定义用户编号 */
    customUserId?: ReturnType<typeof user.getCustomUserId>;
    /** 是否禁用 Facebook 事件功能 */
    noFacebookLogEvent?: typeof noFacebookLogEvent;
    /** 语言类型 */
    language?: typeof language;
    /** 是否初始化后立即渲染 */
    renderImmediately?: typeof renderImmediately;
    /** 页面插件数据 */
    widgets?: InputWidgetData[];
}

/** 初始化函数 */
export function setGlobalParams(param: BothubInitParams) {
    // 页面编号为必填，初始化
    pageId = param.pageId;

    if (param.language) {
        language = param.language;
    }

    if (param.noFacebookLogEvent) {
        noFacebookLogEvent = param.noFacebookLogEvent;
    }

    if (param.customUserId) {
        user.setCustomUserId(param.customUserId);
    }

    if (isDef(param.renderImmediately)) {
        renderImmediately = param.renderImmediately;
    }

    // 调试模式开
    if (debug) {
        // 只有调试模式允许
        if (param.appId) {
            messengerAppId = param.appId;
        }
    }

    // 合并插件列表
    if (param.widgets) {
        setConfig(param.widgets);
    }
}
