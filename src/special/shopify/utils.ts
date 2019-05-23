import Cookie from 'js-cookie';
import uuid from 'uuid';

/** 当前全局用户在 Shopify 的编号 */
let shopifyId = '';

/** 获取用户自定义编号 */
export function getCustomUserId() {
    if (shopifyId) {
        return shopifyId;
    }

    const ref = Cookie.get('_shopify_sa_p');
    const key = 'bothub_custom_user_id';

    if (!ref) {
        shopifyId = `shopify-${uuid()}`;
        return shopifyId;
    }

    const index = ref.indexOf(key);

    if (index < 0) {
        shopifyId = `shopify-${uuid()}`;
        return shopifyId;
    }

    const id = unescape(ref).substr(index + 22, 32);

    // 全局储存
    shopifyId = id;

    Cookie.remove('_shopify_sa_p');
    window.localStorage.setItem(key, JSON.stringify(id));

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
    /** 当前商店的编号 */
    shopId: string;
}

/** 获取当前插件参数 */
function getShopifyParams(): ShopifyConfig {
    const script = document.getElementById('bothub-sdk-shopify') as HTMLScriptElement;

    return {
        recallWidget: script.getAttribute('data-recall-widget') || '',
        reciptWidget: script.getAttribute('data-recipt-widget') || '',
        shopId: script.getAttribute('data-shop-id') || '',
    };
}

/** 当前脚本的配置 */
export const Config = getShopifyParams();
