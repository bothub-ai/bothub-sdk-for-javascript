import uuid from 'uuid';

import { local } from 'src/lib/cache';
import { getQueryString } from 'src/lib/http';

/** 当前用户的 Facebook 编号  */
export const fbUserId = getFacebookUserId();

/** 获取当前 facebook 用户 ID */
export function getFacebookUserId() {
    const key = 'fb_user_id';
    const fbUserId = getQueryString(key) || local.get(key);

    if (fbUserId) {
        local.set(key, fbUserId);
    }

    return fbUserId;
}

/** 获取随机的 User Ref */
export function getUserRef() {
    return `${location.host}_${uuid()}`.replace(/[\.-]/g, '_');
}
