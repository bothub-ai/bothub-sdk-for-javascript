import { getQueryString } from './http';

/** 获取当前 facebook 用户 ID */
export function getFacebookUserId(key: string) {
    const fbUserId = getQueryString(key) || localStorage.getItem(key) || '';

    if (fbUserId) {
        localStorage.setItem(key, fbUserId);
    }

    return fbUserId;
}

/** 获取用户 id */
export function getCustomUserId() {
    const originId = getQueryString('custom_user_id') || localStorage.getItem('bothub_custom_user_id') || '';

    if (originId) {
        return originId;
    }

    const newId = uuid();

    localStorage.setItem('bothub_custom_user_id', newId);

    return newId;
}

/** 获取随机的 Event Id */
export function getEventId() {
    return `bh_eid_${uuid()}`;
}

/** 获取随机的 User Ref */
export function getUserRef(force = false) {
    let userRef = localStorage.getItem('bothub_user_ref');

    if (force || !userRef) {
        userRef = `${location.host.replace(/\./g, '_')}_${uuid()}`;
        localStorage.setItem('bothub_user_ref', userRef);
    }

    return userRef;
}

/**
 * generate a unique id
 * @param {string} str
 */
export function uuid(str?: string): string {
    return str
        ? (Number(str) ^ Math.random() * 16 >> Number(str) / 4).toString(16)
        : '10000000100040008000100000000000'.replace(/[018]/g, uuid);
}

/** 深复制输入值 */
export function copy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

/** debug 模式下输出日志 */
export function log(...args: any[]) {
    if (BOTHUB.debug) {
        console.log(args.join('\n'));
    }
}

/** 获取网页中的插件元素 */
export function getPlugin(name: string) {
    const id = name.replace('fb', 'bothub');
    const plugin = document.getElementById(id);

    if (plugin) {
        plugin.setAttribute('class', name);
        return plugin;
    }

    return document.getElementsByClassName(name)[0];
}
