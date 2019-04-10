import uuid from 'uuid';
import { getQueryString } from './http';

/** 获取当前 facebook 用户 ID */
export function getFacebookUserId(key: string) {
    const fbUserId = getQueryString(key) || localStorage.getItem(key);

    if (fbUserId) {
        localStorage.setItem(key, fbUserId);
    }

    return fbUserId;
}

/** 获取用户 id */
export function getCustomUserId() {
    const originId = (
        getQueryString('custom_user_id') ||
        localStorage.getItem('bothub_custom_user_id')
    );

    if (originId) {
        return originId;
    }

    const newId = uuid();

    localStorage.setItem('bothub_custom_user_id', newId);

    return newId;
}

/** 获取随机的 Event Id */
export function getEventId() {
    return `bh_eid_${uuid().replace(/-/g, '_')}`;
}

/** 获取随机的 User Ref */
export function getUserRef(force = false) {
    let userRef = localStorage.getItem('bothub_user_ref');

    if (force || !userRef) {
        userRef = `${location.host}_${uuid()}`.replace(/[\.-]/g, '_');
        localStorage.setItem('bothub_user_ref', userRef);
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
