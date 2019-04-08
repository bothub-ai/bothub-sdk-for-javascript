import { WidgetData } from 'src/widget';
import { unique } from 'src/lib/native';

/** 是否是调试模式 */
export let debug = false;
/** APP 编号 */
export let messengerAppId = process.env.NODE_MODE === 'development' ? 611599205958417 : 985673201550272;
/** 语言类型 */
export let language: 'zh_CN' | 'zh_TW' | 'en_US' = 'en_US';
// /** 渲染平台 */
// export let platforms: ('facebook' | 'bothub')[] = ['facebook', 'bothub'];
/** 插件配置 */
export let widgets: WidgetData[] = [];

/** 初始化参数 */
interface BothubInitParams {
    /** 是否是调试模式 */
    debug?: typeof debug;
    /**
     * APP 编号
     *  - debug 选项为 true 时才会生效
     */
    appId?: typeof messengerAppId;
    /** 语言类型 */
    language?: typeof language;
    // /** 渲染平台 */
    // platforms?: ('facebook' | 'bothub')[];
    /** 页面插件数据 */
    widgets?: typeof widgets;
}

/** 初始化函数 */
export function setGlobalParams(param: BothubInitParams) {
    if (param.language) {
        language = param.language;
    }

    if (param.debug) {
        debug = param.debug;

        // 只有调试模式允许
        if (param.appId) {
            messengerAppId = param.appId;
        }
    }

    // 合并插件列表
    widgets = unique(widgets.concat(param.widgets || []), ({ id }) => id);
}
