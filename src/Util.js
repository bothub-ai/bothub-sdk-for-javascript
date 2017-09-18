const Cookies = require('js-cookie');

function urlEncode(param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    let t = typeof(param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (let i in param) {
            let k = key == null ? i : key + '[' + i + ']';
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
}

function jsonp(url, cb) {
    let callbackName = 'jsonp_callback_bh' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        // delete window[callbackName];
        document.body.removeChild(script);
        cb && cb(data);
    };

    let script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

function getEventId() {
    return 'bh_eid_' + (new Date).getTime() + '_' + Math.random().toString(36).substr(2, 6);
}

// function getCookie(key) {
//     let res;
//     return (res = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? res[1] : null;
// }

/**
 * @param {bool} fc
 * @return {number}
 */
function getUserRef(fc = false) {
    let str = fc ? 0 : Cookies.get('__bothub_user_ref');

    if (str) {
        // console.log("\\__bothub_user_ref\\new:%s", fc);
        return str;
    } else {
        str = location.host.replace(/\./g, '_') + '_' + (new Date).getTime().toString(36) + '_' + Math.random().toString(36).substr(2);

        Cookies.set('__bothub_user_ref', str, {expires: 1, path: '/'});

        // console.log("\\__bothub_user_ref\\new:%s", fc, str);
        return str;
    }
}

function getFbUserId() {
    const fb_user_id = Cookies.get('__fb_user_id') || getParameterByName('fb_user_id');;
    if (fb_user_id) {
        Cookies.set('__fb_user_id', fb_user_id, { expires: 1, path: '/' });
    }
    return fb_user_id;
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
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

export default {
    urlEncode,
    jsonp,
    getEventId,
    getUserRef,
    getFbUserId,
    getParameterByName,
}
