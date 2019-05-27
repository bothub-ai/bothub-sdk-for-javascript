import Cookie from 'js-cookie';
import uuid from 'uuid';

import { local } from 'src/lib/cache';

/** 当前全局用户在 Shopify 的编号 */
let shopifyId = '';

/** 获取用户自定义编号 */
export function getCustomUserId() {
    if (shopifyId) {
        return shopifyId;
    }

    const key = 'bothub_custom_user_id';
    const ref = Cookie.get('_shopify_sa_p') || '';
    const index = ref.indexOf('bothub_custom_user_id');

    if (index >= 0) {
        const id = unescape(ref).substr(index + 22, 32);

        Cookie.remove('_shopify_sa_p');

        shopifyId = id;
    }
    else {
        shopifyId = local.get(key) || `shopify-${uuid()}`
    }

    local.set(key, shopifyId);

    return shopifyId;
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
    /** 当前商店的编号 */
    shop_id: number;
    /** 商品召回参数 */
    recall?: {
        /** 插件编号 */
        id: string;
        /** 插件类型 */
        type: 'checkbox' | 'discount';

        /** checkbox 文本提示 */
        intro_text?: string;
        /** checkbox 订阅文本提示 */
        subscribed_text?: string;
    };
    /** 订单回执参数 */
    recipt?: {
        id: string;
        type: string;
    };
}

/** 对某些网站的特殊处理 */
const AssertMap: AnyObject<() => Partial<ShopifyConfig>> = {
    'www.getyourbobblehead.com'() {
        // 首页强制什么都不显示
        if (location.pathname === '/') {
            return {
                recall: undefined,
                recipt: undefined,
            };
        }
        else {
            return {};
        }
    },
};

/** 获取当前插件参数 */
function getShopifyParams(): ShopifyConfig {
    const script = document.getElementById('bothub-sdk-cartsbot') as HTMLScriptElement;
    const dataRef = script.getAttribute('data-config');

    if (!dataRef) {
        return { shop_id: 0 };
    }

    try {
        const data: ShopifyConfig = JSON.parse(window.atob(dataRef));

        if (AssertMap[window.location.hostname]) {
            return {
                ...data,
                ...AssertMap[window.location.hostname](),
            };
        }
        else {
            return data;
        }
    }
    catch (e) {
        console.warn('(Bothub SDK Shopify) ' + e.message);
        return { shop_id: 0 };
    }
}

/** 当前脚本的配置 */
export const Config = getShopifyParams();
