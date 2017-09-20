const Cookies = require('js-cookie');

export function urlEncode(param, key, encode = true) {
    if (!param) {
        return '';
    }

    let paramStr = '';
    if ((/string|number|boolean/).test(typeof param)) {
        paramStr += `&${key}=${(encode ? encodeURIComponent(param) : param)}`;
    } else {
        for (const i in param) {
            const k = (!key) ? i : `${key}[${i}]`;
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
}

export function jsonp(url, cb) {
    const script = document.createElement('script'),
        callbackName = 'jsonp_callback_bh' + Math.round(100000 * Math.random());

    window[callbackName] = function(data) {
        document.body.removeChild(script);
        cb && cb(data);
    };

    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

export function getEventId() {
    return `bh_eid_${(new Date()).getTime()}_${Math.random().toString(36).substr(2, 6)}`;
}

export function getUserRef(fc = false) {
    let str = fc ? 0 : Cookies.get('__bothub_user_ref');

    if (!str) {
        str = location.host.replace(/\./g, '_') + '_' + (new Date()).getTime().toString(36) + '_' + Math.random().toString(36).substr(2);
        Cookies.set('__bothub_user_ref', str, { expires: 1, path: '/' });
    }

    return str;
}

export function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);

    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getFbUserId(key) {
    const cooks = `__${key}`,
        fb_user_id = getParameterByName(key) || Cookies.get(cooks);

    if (fb_user_id) {
        Cookies.set(cooks, fb_user_id, { expires: 1, path: '/' });
    }
    return fb_user_id;
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
    'APP_USER_ID': '_app_user_id',
    'APP_VERSION': '_appVersion',
    'CURRENCY': 'fb_currency',
    'REGISTRATION_METHOD': 'fb_registration_method',
    'CONTENT_TYPE': 'fb_content_type',
    'CONTENT_ID': 'fb_content_id',
    'SEARCH_STRING': 'fb_search_string',
    'SUCCESS': 'fb_success',
    'MAX_RATING_VALUE': 'fb_max_rating_value',
    'PAYMENT_INFO_AVAILABLE': 'fb_payment_info_available',
    'NUM_ITEMS': 'fb_num_items',
    'LEVEL': 'fb_level',
    'DESCRIPTION': 'fb_description',
};
