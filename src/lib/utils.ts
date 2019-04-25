import uuid from 'uuid';

import { isIOS } from './env';
import { local } from './cache';
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
export function getUserRef() {
    return `${location.host}_${uuid()}`.replace(/[\.-]/g, '_');
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

/** 复制文本到剪贴板 */
export function copy(text: string) {
    const input = document.createElement('textarea');

    input.value = text;

    input.style.fontSize = '12pt';
    input.style.position = 'fixed';
    input.style.top = '0';
    input.style.left = '-9999px';
    input.style.width = '2em';
    input.style.height = '2em';
    input.style.margin = '0';
    input.style.padding = '0';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.boxShadow = 'none';
    input.style.background = 'transparent';

    input.setAttribute('readonly', '');

    document.body.appendChild(input);

    if (isIOS) {
        input.contentEditable = 'true';
        input.readOnly = false;

        const range = document.createRange();
        range.selectNodeContents(input);

        const selection = window.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);

        input.setSelectionRange(0, 999999);
    }
    else {
        input.select();
    }

    const ret = document.execCommand('copy');

    input.blur();
    document.body.removeChild(input);

    return ret;
}
