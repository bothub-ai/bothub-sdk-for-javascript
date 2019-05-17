import {
    getUserRef,
    getFacebookUserId,
} from './facebook';

import {
    getCustomUserId,
    getNewCustomUserId,
    changeCustomUserId,
} from './bothub';

export * from './bothub';
export * from './facebook';

// 默认导出为对外暴露的接口
export default {
    getUserRef,
    getFacebookUserId,
    getCustomUserId,
    getNewCustomUserId,
    changeCustomUserId,
};
