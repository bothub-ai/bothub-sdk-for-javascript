import { initAddtoCard } from './product';
import { initSendMessenger, logPurchaseEvent } from './checkout';

const widgetType = '{{{widgetType}}}';

// 初始化函数
window.bhAsyncInit = () => {
    initAddtoCard();
    logPurchaseEvent();
};
