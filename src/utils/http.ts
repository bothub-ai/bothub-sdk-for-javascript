import { isBaseType, isFunction, isUndef } from './assert';

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
 * TODO: 输入参数的属性值为对象
 * @param {object} params 参数对象
 * @returns {string}
 */
export function createUrlParam(params: any) {
    if (isBaseType(params)) {
        return '';
    }

    const result = [];

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const value = isFunction(params[key]) ? params[key]() : params[key];
            const paramKey = encodeURIComponent(key);
            const paramValue = encodeURIComponent(isUndef(value) ? '' : value);

            result.push(`${paramKey}=${paramValue}`);
        }
    }

    return result.join('&');
}

/** jsonp 请求接口 */
export function jsonp<T>(url: string, params: AnyObject = {}): Promise<T> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'jsonp_callback_bh' + Math.round(100000 * Math.random());
        const timer = setTimeout(() => (cleanup(), reject(new Error('jsonp timeout'))), 15000);

        params.callback = callbackName;

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
        script.src = `${url}?${createUrlParam(params)}`;

        document.body.appendChild(script);
    });
}

/** ajax 请求接口 */
function ajax<T>(type: 'GET' | 'POST', url: string, data?: AnyObject) {
    return new Promise<T>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(type, url);

        if (type === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.send(type === 'GET' ? null : JSON.stringify(data));

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
export const get = <T>(url: string) => ajax<T>('GET', url);

/** POST 请求 */
export const post = <T>(url: string, data: any) => ajax<T>('POST', url, data);
