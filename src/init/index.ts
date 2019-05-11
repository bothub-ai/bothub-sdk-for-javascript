import './polyfill';
import 'src/style';

import Bothub from './bothub';

import { sandBox } from 'src/lib/utils';
import { isArray } from 'src/lib/assert';

// 全局 Bothub 命名空间声明
declare global {
    interface Window {
        BH: typeof Bothub;
    }
}

// 初始化入口
Object.defineProperty(window, 'BH', {
    enumerable: false,
    value: {
        ...Bothub,
        ...(window.BH || {}),
    },
});

// 运行入口函数
setTimeout(() => {
    const bhAsyncInit = window.bhAsyncInit;

    if (isArray(bhAsyncInit)) {
        bhAsyncInit.forEach((cb) => sandBox(cb)());
    }
    else if (bhAsyncInit) {
        sandBox(bhAsyncInit)();
    }
});
