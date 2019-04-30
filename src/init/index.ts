import './polyfill';
import 'src/style';

import Bothub from './bothub';

import { sandBox } from 'src/lib/utils';
import { isArray } from 'src/lib/assert';

// 初始化入口
if (!('BH' in window)) {
    Object.defineProperty(window, 'BH', {
        enumerable: false,
        value: Bothub,
    });
}

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
