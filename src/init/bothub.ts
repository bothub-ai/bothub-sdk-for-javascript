import Widget from 'src/widget';
import User from 'src/module/user';
import Event from 'src/module/event';

import * as Store from 'src/store';
import * as Facebook from 'src/lib/facebook';

function init(...arg: Parameters<typeof Store.setGlobalParams>) {
    Store.setGlobalParams(...arg);

    // 禁用 facebook 相关功能
    if (Store.noFacebookLogEvent) {
        return;
    }

    // 加载 facebook SDK
    Facebook.loadFacebookSDK();
    // 设置 facebook SDK 初始化函数
    Facebook.facebookInit();
}

export default {
    /** 初始化函数 */
    init,
    /** 用户信息 */
    User: { ...User },
    /** 应用事件 */
    Event: { ...Event },
    /** 插件模块 */
    Widget: { ...Widget },
};
