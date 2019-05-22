import uuid from 'uuid';
import { isBaseType, isUndef } from './assert';

/** 全局后端地址常量 */
const apiServer = process.env.api as string;

/**
 * 由输入对象创建 url 链接参数
 * @param {object} params 参数对象
 * @returns {string}
 */
function urlEncode(params: object) {
    /** 解析参数中的对象 */
    function objEncode(from: object, pre = '') {
        let ans = '';

        for (const key in from) {
            if (from.hasOwnProperty(key)) {
                const val = from[key];

                if (isUndef(val)) {
                    continue;
                }

                // 非顶级属性则需要加上方括号
                const uKey = pre.length > 0 ? `[${key}]` : key;
                // 连接参数
                ans += isBaseType(val)
                    ? `&${pre}${uKey}=${encodeURIComponent(val!.toString())}`
                    : `&${objEncode(val, `${pre}${uKey}`)}`;
            }
        }

        return ans.substring(1);
    }

    const result = objEncode(params);

    return result.length > 0 ? ('?' + result) : '';
}

/**
 *  编译请求地址
 * @param {string} url 请求地址
 */
function getUrl(url: string) {
    // url 为完整网址时，直接返回
    if (url.indexOf('http') === 0) {
        return url;
    }
    // 不完整的链接要补齐请求地址
    else {
        return apiServer + url.replace(/^\/+/, '');
    }
}

/**
 * 获取 Url 查询参数
 * @param {stirng} name 参数名称
 * @param {string} url 待检测的链接
 * @returns {string}
 */
export function getQueryString(name: string, url = window.location.href) {
    const reg = `(^|&)${name}=([^&]*)(&|$)`;
    const search = url.substring(url.indexOf('?'));
    const result = search.substr(1).match(reg);

    return result ? unescape(result[2]) : null;
}

/** jsonp 请求接口 */
export function jsonp<T = any>(url: string, params: object = {}) {
    return new Promise<T>((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'jsonp_callback_bh_' + uuid().replace(/-/g, '_');
        const timer = setTimeout(() => (cleanup(), reject(new Error('jsonp timeout'))), 15000);
        const urlParams = {
            ...params,
            callback: callbackName,
        };

        /** 清除此次请求在全局的痕迹 */
        function cleanup() {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }

            delete window[callbackName];

            if (timer) {
                clearTimeout(timer);
            }
        }

        window[callbackName] = (data: T) => {
            resolve(data);
            cleanup();
        };

        script.type = 'text/javascript';
        script.src = getUrl(url) + urlEncode(urlParams);

        document.body.appendChild(script);
    });
}

/** ajax 请求接口 */
function ajax<T>(type: 'GET' | 'POST', url: string, data?: object) {
    return new Promise<T>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(type, getUrl(url));

        if (type === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.send((type === 'POST' && data) ? JSON.stringify(data) : null);

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                reject(new Error(`Network Error: ${xhr.status}`));
            }
        };
    });
}

/** GET 请求 */
export const get = <T = any>(url: string, params: object = {}) => ajax<T>('GET', `${url}${urlEncode(params)}`);

/** POST 请求 */
export const post = <T = any>(url: string, data?: object) => ajax<T>('POST', url, data);
