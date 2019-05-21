import Cookie from 'js-cookie';

import { CustomUserIdKey } from 'src/module/user';

/** 获取用户自定义编号 */
export function getCustomUserId() {
    const ref = Cookie.get('_shopify_sa_p');
    let index = 0;

    if (ref) {
        index = ref.indexOf(CustomUserIdKey);

        if (index >= 0) {
            Cookie.remove('_shopify_sa_p');
            return unescape(ref).substr(index + 22, 32);
        }
    }
}

/** 修复链接 */
export function fixUrl(url: string) {
    if (/^\/\//.test(url)) {
        return 'https:' + url;
    }
    else {
        return url;
    }
}
