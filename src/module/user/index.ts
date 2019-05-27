import {
    getCustomUserId,
    changeCustomUserId,
} from './bothub';

export * from './bothub';
export * from './facebook';

// 默认导出为对外暴露的接口
export default {
    getCustomUserId,
    changeCustomUserId,
};
