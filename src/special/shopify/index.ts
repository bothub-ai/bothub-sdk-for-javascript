import { getCustomUserId } from './utils';
import { getQueryString } from 'src/lib/http';
import { loadScript } from 'src/lib/utils';

import { initCheckbox } from './product';
import { initSendMessenger, logPurchaseEvent } from './checkout';

// 页面编号，产品模式是由 php 注入，调试模式默认为“小猫小狗”主页，也可以在 url 中直接设置
const pageId = process.env.NODE_ENV === 'development'
    ? getQueryString('pageId') || '374118179628713'
    : '{{{pageId}}}';

// 初始化函数
window.bhAsyncInit = () => {
    // 插件初始化
    window.BH.init({
        pageId,
        customUserId: getCustomUserId(),
        widgets: [
            initCheckbox() as any,
            initSendMessenger() as any,
        ],
    });

    // 立即发送事件
    logPurchaseEvent();
};

loadScript(
    process.env.NODE_ENV === 'development'
        ? '../sdk.js'
        : 'https://sdk.bothub.ai/sdk.js',
);
