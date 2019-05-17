import uuid from 'uuid';

import { post } from 'src/lib/http';
import { local } from 'src/lib/cache';
import { pageId } from 'src/store';
import { getQueryString } from 'src/lib/http';

/** 当前用户的自定义编号 */
export let customUserId: string = getCustomUserId();

/** 用户自定义编号存储用的键值 */
export const CustomUserIdKey = 'bothub_custom_user_id';

/** 记录用户编号 */
export function setCustomUserId(id: string) {
    const key = 'bothub_custom_user_id';
    local.set(key, id);
    customUserId = id;
}

/** 获取新的自定义用户 ID */
export function getNewCustomUserId() {
    const newId = uuid();
    setCustomUserId(newId);
    return newId;
}

/**
 * 获取用户编号
 *  - url、localStorage、新建用户，三者优先级依次排列
 */
export function getCustomUserId() {
    const key = 'bothub_custom_user_id';
    return customUserId || getQueryString(key) || local.get(key) || getNewCustomUserId();
}

/** 变更用户 ID */
export function changeCustomUserId(id = uuid()) {
    const result = post(`analytics/${pageId}/updateCustomUserId`, {
        old_custom_user_id: getCustomUserId(),
        new_custom_user_id: id,
    });

    return result.then(() => {
        setCustomUserId(id);
        return id;
    });
}
