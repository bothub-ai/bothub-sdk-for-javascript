import './polyfill';
import 'src/style';

import Bothub from './bothub';
import { isArray } from 'src/lib/assert';

// 初始化入口
if (!('BOTHUB' in window)) {
    Object.defineProperty(window, 'BOTHUB', {
        enumerable: true,
        value: Bothub,
    });
}

// 运行入口函数
setTimeout(() => {
    const bhAsyncInit = window.bhAsyncInit;

    if (isArray(bhAsyncInit)) {
        bhAsyncInit.forEach((cb) => cb());
    }
    else {
        bhAsyncInit && bhAsyncInit();
    }
});
