import uuid from 'uuid';
import { isBaseType, isUndef } from './assert';

/**
 * 获取 Url 查询参数
 * @param {stirng} name
 * @returns {string}
 */
export function getQueryString(name: string) {
    const reg = `(^|&)${name}=([^&]*)(&|$)`;
    const result = window.location.search.substr(1).match(reg);

    return result ? unescape(result[2]) : null;
}

/**
 * 由输入对象创建 url 链接参数
 * @param {object} params 参数对象
 * @returns {string}
 */
export function urlEncode(params: object) {
    /** 解析参数中的对象 */
    function objEncode(from: object, pre = '') {
        let ans = '';

        for (const key in from) {
            if (params.hasOwnProperty(key)) {
                const val = from[key];

                if (isUndef(val)) {
                    continue;
                }

                ans += isBaseType(val)
                    ? `&${pre}[${key}]=${encodeURIComponent(val!.toString())}`
                    : `&${objEncode(val, `${pre}[${key}]`)}`;
            }
        }

        return ans;
    }

    const result = objEncode(params).substring(1);

    return result.length > 0 ? ('?' + result) : '';
}

/** jsonp 请求接口 */
export function jsonp<T>(url: string, params: object = {}) {
    return new Promise<T>((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'jsonp_callback_bh_' + uuid().replace('-', '_');
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
        script.src = url + urlEncode(urlParams);

        document.body.appendChild(script);
    });
}

/** ajax 请求接口 */
function ajax<T extends object>(type: 'GET' | 'POST', url: string, data?: object) {
    return new Promise<T>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(type, url);

        if (type === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        if (type === 'POST' && data) {
            xhr.send(JSON.stringify(data));
        }

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
export const get = <T extends object>(url: string, params: object = {}) => ajax<T>('GET', `${url}${urlEncode(params)}`);

/** POST 请求 */
export const post = <T extends object>(url: string, data?: object) => ajax<T>('POST', url, data);
