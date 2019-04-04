import Marketing from 'src/plugin/marketing';
import Ecommerce from 'src/plugin/ecommerce';
import { default as Widget, WidgetData } from 'src/widget';

/** 初始化参数 */
interface BothubInitParams {
    /** 是否是调试模式 */
    debug?: boolean;
    /** 连接的 Facebook 页面编号 */
    pageId: number;
    /**
     * APP 编号
     *  - debug 选项为 true 时才会生效
     */
    appId?: number;
    /** 语言类型 */
    language?: 'zh_CN' | 'zh_TW' | 'en_US';
    /** TODO: 渲染平台 */
    // platforms?: ('facebook' | 'bothub')[];
    /** 页面插件数据 */
    plugins: WidgetData[];
}

/** 初始化函数 */
function init(param: BothubInitParams) {

}

export default {
    /** 初始化函数 */
    init,
    /** 订单数据类 */
    Ecommerce,
    /** 营销功能类 */
    Marketing,
};
