import Cookie from 'js-cookie';

import { getQueryString } from 'src/lib/http';
import { CustomUserIdKey, setCustomUserId } from 'src/module/user';

/** 获取用户自定义编号 */
export function getCustomUserId() {
    const ref = Cookie.get('_shopify_sa_p');

    if (!ref) {
        return;
    }

    const index = ref.indexOf(CustomUserIdKey);

    if (index < 0) {
        return;
    }

    const id = unescape(ref).substr(index + 22, 32);

    Cookie.remove('_shopify_sa_p');
    setCustomUserId(id);

    return id;
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

/** 当前 Shopify 配置 */
interface ShopifyConfig {
    /** 商品召回事件的插件编号 */
    recallWidget: string;
    /** 发送订单回执的插件编号 */
    reciptWidget: string;
}

/** 获取当前插件参数 */
function getShopifyParams(): ShopifyConfig {
    const scripts = document.getElementsByTagName('script');
    let url = '';

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];

        if (/bothub[\.a-z-\/]+\/special\/shopify\.js/.test(script.src)) {
            url = script.src;
            break;
        }
    }

    return {
        recallWidget: getQueryString('visible_recall_widget', url) || '',
        reciptWidget: getQueryString('visible_recipt_widget', url) || '',
    };
}

/** 当前脚本的配置 */
export const Config = getShopifyParams();
