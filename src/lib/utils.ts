import uuid from 'uuid';

import { session, local } from './cache';
import { getQueryString } from './http';

/** 获取当前 facebook 用户 ID */
export function getFacebookUserId() {
    const key = 'fb_user_id';
    const fbUserId = getQueryString(key) || local.get(key);

    if (fbUserId) {
        local.set(key, fbUserId);
    }

    return fbUserId;
}

/** 获取用户 id */
export function getCustomUserId() {
    const key = 'bothub_custom_user_id';
    const originId = getQueryString(key) || local.get(key);

    if (originId) {
        return originId;
    }

    const newId = uuid();

    local.set(key, newId);

    return newId;
}

/** 获取随机的 Event Id */
export function getEventId() {
    return `bh_eid_${uuid().replace(/-/g, '_')}`;
}

/** 获取随机的 User Ref */
export function getUserRef(force = false) {
    let userRef = session.get('bothub_user_ref');

    if (force || !userRef) {
        userRef = `${location.host}_${uuid()}`.replace(/[\.-]/g, '_');
        session.set('bothub_user_ref', userRef);
    }

    return userRef;
}

/** 函数沙箱 */
export function sandBox<T extends (...args: any[]) => any>(cb: T) {
    return (...args: Parameters<T>): ReturnType<T> | Error => {
        let result: ReturnType<T>;

        try {
            result = cb(...args);
        }
        catch (e) {
            return e;
        }

        return result;
    };
}

/**
 * 异步延迟函数
 * @param {number} [time] 延迟时间
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
}

/**
 * 轮询等待输入函数输出`true`
 * @param {() => boolean} fn
 * @param {number} [interval=200]
 * @param {number} [stopTimeout=60000]
 * @returns {Promise<void>}
 */
export function wait(fn: () => boolean, interval = 200, stopTimeout = 60000) {
    let timeout = false;

    const timer = setTimeout(() => timeout = true, stopTimeout);

    return (function check(): Promise<void> {
        if (fn()) {
            clearTimeout(timer);
            return Promise.resolve();
        }
        else if (!timeout) {
            return delay(interval).then(check);
        }
        else {
            return Promise.resolve();
        }
    })();
}
