if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: (target) => {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }
            const to = Object(target);
            for (let i = 1; i < arguments.length; i++) {
                let nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);
                const keysArray = Object.keys(Object(nextSource));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        },
    });
}

/**
 * @param {object}  param
 * @param {string}  key
 * @param {bool}    encode
 */
export function urlEncode(param, key, encode) {
    encode = encode || true;
    if (!param) return '';
    let paramStr = '';

    if ((/string|number|boolean/).test(typeof param)) {
        return (paramStr += `&${key}=${(encode ? encodeURIComponent(param) : param)}`);
    }

    for (const i in param) {
        const k = (!key) ? i : `${key}[${i}]`;
        paramStr += urlEncode(param[i], k, encode);
    }

    return paramStr;
}

/**
 * @param {string} name
 */
export function getUrlParam(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return (decodeURI(r[2])); return null;
}

/**
 * generate a unique id
 * @param {string} a
 */
export function uuid(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, uuid);
}

/**
 * copy object
 * @param {object} obj
 */
export function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * log when debug mode
 * @param {string} str
 */
export function log() {
    if (BOTHUB.debug) {
        for (const key in arguments) {
            console.log(arguments[key]);
        }
    }
}

export function jsonp(url, callback) {
    const script = document.createElement('script');
    const callbackName = 'jsonp_callback_bh' + Math.round(100000 * Math.random());

    window[callbackName] = function(data) {
        document.body.removeChild(script);
        callback && callback(data);
    };

    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

function ajax(type, url, data) {
    const xhr = new XMLHttpRequest();

    xhr.open(type, url);

    if (type === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.send(type === 'GET' ? null : JSON.stringify(data));

    return xhr;
}

export const Http = {
    get: (url, data) => ajax('GET', url, data),
    post: (url, data) => ajax('POST', url, data),
};

export function getCustomUserId() {
    let custom_user_id = getUrlParam('custom_user_id') || localStorage.getItem('bothub_custom_user_id') || '';
    if (custom_user_id) return custom_user_id;
    custom_user_id = uuid();
    localStorage.setItem('bothub_custom_user_id', custom_user_id);
    return custom_user_id;
}

export function getFacebookUserId(key) {
    const fb_user_id = getUrlParam(key) || localStorage.getItem(key) || '';

    if (fb_user_id) {
        localStorage.setItem(key, fb_user_id);
    }

    return fb_user_id;
}

export function getEventId() {
    return `bh_eid_${uuid()}`;
}

export function getUserRef(force) {
    force = force || false;

    let user_ref = localStorage.getItem('bothub_user_ref');

    if (force || !user_ref) {
        user_ref = location.host.replace(/\./g, '_') + '_' + uuid();
        localStorage.setItem('bothub_user_ref', user_ref);
    }

    return user_ref;
}

export function getPlugin(name) {
    const id = name.replace('fb', 'bothub');
    const plugin = window[id];

    if (plugin) {
        plugin.setAttribute('class', name);
        return plugin;
    }

    return document.getElementsByClassName(name)[0];
}

export function loadFacebookSdk(bothub) {
    if (window['facebook-jssdk']) return;

    if (['zh_CN', 'zh_TW', 'en_US'].indexOf(bothub.language) === -1) {
        bothub.language = 'zh_CN';
    }

    log('start load facebook sdk...');

    const facebook_script = document.createElement('script');
    facebook_script.id = 'facebook-jssdk';
    facebook_script.src = `https://connect.facebook.net/${bothub.language}/${bothub.debug ? 'sdk/debug' : 'sdk'}.js`;
    document.body.appendChild(facebook_script);
}
