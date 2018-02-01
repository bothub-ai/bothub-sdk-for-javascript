const Cookies = require('js-cookie');

export function isOldIE() {
    return navigator.appName === 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', '')) < 9;
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
 * Whether the data has a property of cookie
 * 
 * @param {any} data 
 * @returns {boolean}
 */
function dataHasCookies(data) {
    return (
        (data instanceof Object) &&
        (data.hasOwnProperty('cookies')) &&
        (data.cookies instanceof Array)
    );
}

/**
 * Whether the data is a standard cookie format
 * 
 * @param {any} data 
 * @returns {boolean}
 */
function validateCookies(data) {
    return (
        data.name &&
        (data.value || data.value === '') &&
        (/(string|number)/.test(typeof data.name)) &&
        (/(string|number)/.test(typeof data.value)) &&
        ((data.attributes instanceof Object) || (!data.attributes))
    );
}

/**
 * log when debug mode
 * @param {string} str 
 */
export function log() {
    if (window.bothubDebug) {
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

        if (dataHasCookies(data)) {
            const cookies = data.cookies;
            for (const key in cookies) {
                if (validateCookies(cookies[key])) {
                    Cookies.set(`__bothub_${cookies[key].name}`, cookies[key].value, cookies[key].attributes);
                }
            }
        }

        callback && callback(data);
    };

    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

export function getUserId() {
    return Cookies.get('__bothub_user_id') || null;
}

export function getCustomUserId() {
    let custom_user_id = getUrlParam('custom_user_id') || Cookies.get('bothub_custom_user_id') || '';
    if (custom_user_id) return custom_user_id;
    custom_user_id = uuid();
    Cookies.set('bothub_custom_user_id', custom_user_id, { expires: 365, path: '/' });
    return custom_user_id;
}

export function getFacebookUserId(key) {
    const cookies_key = `__${key}`;
    const fb_user_id = getUrlParam(key) || Cookies.get(cookies_key) || '';

    if (fb_user_id) {
        Cookies.set(cookies_key, fb_user_id, { expires: 1, path: '/' });
    }

    return fb_user_id;
}

export function getEventId() {
    return `bh_eid_${uuid()}`;
}

export function getUserRef(force) {
    force = force || false;
    let user_ref = Cookies.get('__bothub_user_ref');

    if (force || !user_ref) {
        user_ref = location.host.replace(/\./g, '_') + '_' + uuid();
        Cookies.set('__bothub_user_ref', user_ref, { expires: 1, path: '/' });
    }

    return user_ref;
}

export function loadFacebookSdk(bothub) {
    if (['zh_CN', 'zh_TW', 'en_US'].indexOf(bothub.language) === -1) {
        bothub.language = 'zh_CN';
    }

    if (window['facebook-jssdk']) {
        log('duplicate load facebook-jssdk, see https://github.com/bothub-ai/bothub-sdk-for-javascript');
    } else {
        log('start load facebook sdk...');
        const facebook_script = document.createElement('script');
        facebook_script.id = 'facebook-jssdk';
        facebook_script.src = bothub.debug
            ? `https://connect.facebook.net/${bothub.language}/sdk/debug.js`
            : `https://connect.facebook.net/${bothub.language}/sdk.js`;
        document.body.appendChild(facebook_script);
    }
}

export const EventNames = {
    ACHIEVED_LEVEL: 'fb_mobile_level_achieved',
    ADDED_PAYMENT_INFO: 'fb_mobile_add_payment_info',
    ADDED_TO_CART: 'fb_mobile_add_to_cart',
    ADDED_TO_WISHLIST: 'fb_mobile_add_to_wishlist',
    COMPLETED_REGISTRATION: 'fb_mobile_complete_registration',
    COMPLETED_TUTORIAL: 'fb_mobile_tutorial_completion',
    INITIATED_CHECKOUT: 'fb_mobile_initiated_checkout',
    PAGE_VIEW: 'fb_page_view',
    RATED: 'fb_mobile_rate',
    SEARCHED: 'fb_mobile_search',
    SPENT_CREDITS: 'fb_mobile_spent_credits',
    UNLOCKED_ACHIEVEMENT: 'fb_mobile_achievement_unlocked',
    VIEWED_CONTENT: 'fb_mobile_content_view',
};

export const ParameterNames = {
    APP_USER_ID: '_app_user_id',
    APP_VERSION: '_appVersion',
    CURRENCY: 'fb_currency',
    REGISTRATION_METHOD: 'fb_registration_method',
    CONTENT_TYPE: 'fb_content_type',
    CONTENT_ID: 'fb_content_id',
    SEARCH_STRING: 'fb_search_string',
    SUCCESS: 'fb_success',
    MAX_RATING_VALUE: 'fb_max_rating_value',
    PAYMENT_INFO_AVAILABLE: 'fb_payment_info_available',
    NUM_ITEMS: 'fb_num_items',
    LEVEL: 'fb_level',
    DESCRIPTION: 'fb_description',
};
