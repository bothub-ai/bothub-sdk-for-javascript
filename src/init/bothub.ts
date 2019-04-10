import Widget from 'src/widget';
import Marketing from 'src/module/marketing';
import Ecommerce from 'src/module/ecommerce';

import * as Store from 'src/store';
import * as FB from 'src/lib/facebook';

function init(...arg: Parameters<typeof Store.setGlobalParams>) {
    Store.setGlobalParams(...arg);

    // 禁用 facebook 相关功能
    if (Store.disableFacebook) {
        return;
    }

    // 加载 facebook SDK
    FB.loadFacebookSDK();
    // 设置 facebook SDK 初始化函数
    FB.facebookInit();

    // 插件初始化
    Widget.render();
}

export default {
    /** 初始化函数 */
    init,
    /** 订单模块 */
    Ecommerce,
    /** 营销模块 */
    Marketing,
    /** 插件模块 */
    Widget,
};
