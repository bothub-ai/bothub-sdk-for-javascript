import { WidgetType, WidgetData, Widget } from 'src/widget';
import { isDef, isNumber } from 'src/lib/assert';

import * as utils from 'src/lib/utils';

/** 是否是调试模式 */
export let debug = false;
/** APP 编号 */
export let messengerAppId = process.env.appId as string;
/** 是否强行禁用 Facebook 相关事件 */
export let disableFacebook = false;
/** 语言类型 */
export let language: 'zh_CN' | 'zh_TW' | 'en_US' = 'en_US';
/** 是否在初始化后立即渲染 */
export let renderImmediately = true;
/** 插件配置原始数据 */
export const widgetData: WidgetData[] = [];
/** 页面上的所有插件 */
export const widgets: Widget[] = [];

/** 当前用户引用参数 */
export const userRef = utils.getUserRef();
/** 当前用户的自定义编号 */
export const customUserId = utils.getCustomUserId();
/** 当前用户的 Facebook 编号  */
export const fbUserId = utils.getFacebookUserId();

/** 插件输入数据类型 */
type InputWidgetData = Omit<WidgetData, 'type'> & {
    type: WidgetType | keyof typeof WidgetType;
};

/** 初始化参数 */
interface BothubInitParams {
    /** 是否是调试模式 */
    debug?: typeof debug;
    /**
     * APP 编号
     *  - debug 选项为`true`时才会生效
     */
    appId?: typeof messengerAppId;
    /** 是否禁用 Facebook 相关功能 */
    disableFacebook?: typeof disableFacebook;
    /** 语言类型 */
    language?: typeof language;
    /** 页面插件数据 */
    widgets?: InputWidgetData[];
    /** 是否初始化后立即渲染 */
    renderImmediately?: typeof renderImmediately;
}

/** 初始化函数 */
export function setGlobalParams(param: BothubInitParams) {
    if (param.language) {
        language = param.language;
    }

    if (param.disableFacebook) {
        disableFacebook = param.disableFacebook;
    }

    if (isDef(param.renderImmediately)) {
        renderImmediately = param.renderImmediately;
    }

    if (param.debug) {
        debug = param.debug;

        // 只有调试模式允许
        if (param.appId) {
            messengerAppId = param.appId;
        }
    }

    const toWidgetData = (item: InputWidgetData): WidgetData => {
        return isNumber(item.type) ? item : {
            ...item,
            type: WidgetType[item.type],
        } as any;
    };

    // 合并插件列表
    (param.widgets || []).forEach((item) => {
        const origin = widgetData.find(({ id: local }) => local === item.id);

        // 找到 id 重复的插件，合并
        if (origin) {
            Object.assign(origin, toWidgetData(item));
        }
        // 未找到 id 重复的插件，则添加新插件
        else {
            widgetData.push(toWidgetData(item));
        }
    });
}
