import { initAddToCard } from './product';
import { logPurchaseEvent } from './checkout';

function init() {
    initAddToCard();
    logPurchaseEvent();
}

// 初始化函数
if (!window.bhAsyncInit) {
    window.bhAsyncInit = [init];
}
else if (Array.isArray(window.bhAsyncInit)) {
    window.bhAsyncInit.push(init);
}
else {
    const oldCb = window.bhAsyncInit;
    window.bhAsyncInit = [oldCb, init];
}
